import Colors from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { Text, ToastAndroid, View } from 'react-native';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { GoogleGenAI } from "@google/genai";
import { z } from 'zod';
import { router, useGlobalSearchParams } from 'expo-router';
import {
    collection,
    doc,
    getDoc,
    getFirestore,
    query
} from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';
import { profileTags, exfoliantNames, emollientNames, emulsifierNames, skinLighteningNames, moisturizerNames, retinoidNames, skinRestoringNames } from '@/constants/ProfileTags';

export default function Processing() {
    const { name, brand, notes, ingredients } = useGlobalSearchParams();
    const db = getFirestore();

    const fetchData = async () => {
        const queryOption = query(doc(db, 'users', auth.currentUser.uid));

        const documentSnapshot = await getDoc(queryOption);

        return documentSnapshot.data().profiling;
    };

    const fetchIngredients = async () => {
        const queryOption = query(collection(db, 'ingredients_glossary'));

        const collectionSnapshot = await getDocs(queryOption);

        return collectionSnapshot.docs.map(doc => doc.data());
    };

    const ai = new GoogleGenAI({
        apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    });

    const flaggedIngredientSchema = z.object({
        status: z.enum(['restricted', 'aligned', 'attention', 'base', 'unrecognized']),
        ingredientName: z.string(),
        ingredientDescription: z.string(),
    });

    const contextURLs = [
        "https://www.jessicaelizabethskincare.com/wp-content/uploads/2023/01/Pore-Clogging-Ingredients-.pdf",
        "https://www.personalcarecouncil.org/wp-content/uploads/2023/03/INCI-Nomenclature-Conventions-and-Reference-Information-2023.pdf",
        "https://asean.org/wp-content/uploads/2023/08/Annex-II-Release_5-Jun-2023.pdf",
        "https://www.aseancosmetics.org/docdocs/technical.pdf",
        "https://int.eucerin.com/about-skin/basic-skin-knowledge/skin-types",
        "https://www.medicalnewstoday.com/articles/hair-types#hair-types",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC6560912/pdf/12915_2019_Article_660.pdf",
        "https://health.clevelandclinic.org/skin-care-ingredients-explained",
        "https://www.researchgate.net/publication/334857152_Impact_of_Selected_Cosmetic_Ingredients_on_Common_Microorganisms_of_Healthy_Human_Skin/fulltext/5d439a27299bf1995b5e6729/Impact-of-Selected-Cosmetic-Ingredients-on-Common-Microorganisms-of-Healthy-Human-Skin.pdf?_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6InB1YmxpY2F0aW9uIiwicGFnZSI6InB1YmxpY2F0aW9uIn19",
        "https://www.clinikally.com/blogs/news/harmful-hair-care-ingredients-to-avoid",
        "https://dela.pl/a-guide-to-active-ingredients-in-cosmetics-understand-and-use-to-your-advantage/"
    ]

    const outputSchema = z.object({
        flagged_ingredients: z.array(flaggedIngredientSchema),
    });

    //TODO: implement storage of scan history in Firebase, and retrieval of scan history in history screen

    const analyzeIngredients = async (input) => {
        const { ingredients, userProfile, contextURLs } = input;
        const prompt = `You are an objective cosmetic data-matching engine. Your task is to categorize a provided list of cosmetic ingredients based strictly on established cosmetic literature (such as the ASEAN Cosmetic Directive, FDA guidelines, and standard comedogenic scales) and cross-reference them with the user's self-reported skin and hair profile. 

    CRITICAL RULES:
    1. DO NOT act as a dermatologist or a medical professional.
    2. DO NOT make medical diagnoses, therapeutic claims, or state that a product is 100% "safe" or "dangerous," as you cannot account for complex chemical interactions or concentrations.
    3. Use objective, educational language (e.g., "known in cosmetic literature to...", "has a high rating on the comedogenic scale").
    4. Base your analysis strictly on the provided Context URLs and established public cosmetic databases.
    5. STRICT COMPLETENESS: You must analyze EVERY SINGLE INGREDIENT provided in the input list. Do not skip, group, or omit any ingredient. The number of items in your JSON output array must exactly match the number of ingredients in the input.

    CATEGORIZATION FLAGS (Assign exactly ONE mutually exclusive flag to EACH ingredient):
    - "restricted": Use ONLY if the ingredient is strictly banned or highly restricted by FDA/ACD guidelines (e.g., Hydroquinone, Triclosan).
    - "aligned": Use if cosmetic literature explicitly states the ingredient targets or supports the user's specific self-reported concerns (e.g., soothing ingredients for redness-prone skin).
    - "attention": Use if the ingredient conflicts with the user's profile based on literature (e.g., highly comedogenic ingredients for acne-prone users, or known drying alcohols for dry skin).
    - "base": Use for standard formulation components with no direct conflict or active targeting (e.g., solvents, preservatives, thickeners like Water, Glycerin, Carbomer).
    - "unrecognized": Use if the ingredient is misspelled, missing from standard cosmetic databases, or likely an OCR error.

    User's Self-Reported Skin Profile:
    Post-wash feel: ${userProfile.the_wash_test.post_wash_feel}
    Pore Size: ${userProfile.the_wash_test.pore_visibility}
    Mid Day Shine: ${userProfile.the_wash_test.mid_day_shine}
    Product reactivity: ${userProfile.sensitivity_reactivity.product_reactivity}
    Redness prone: ${userProfile.sensitivity_reactivity.redness_prone}
    Breakout frequency: ${userProfile.acne_texture.breakout_frequency}
    Texture concern: ${userProfile.acne_texture.texture_concern}
    Climate reactivity: ${userProfile.environmental_factors.climate_reactivity}

    User's Self-Reported Hair Profile:
    Hair length: ${userProfile.hair_length_structure.hair_length}
    Hair pattern: ${userProfile.hair_classification.hair_pattern}
    Hair texture: ${userProfile.hair_classification.hair_texture}
    Hair density: ${userProfile.hair_classification.hair_scalp_density}
    Water absorption: ${userProfile.hair_porosity.water_absorption}
    Drying time: ${userProfile.hair_porosity.air_dry_time}
    Scalp condition: ${userProfile.scalp_health.scalp_condition}
    Hair concern: ${userProfile.scalp_health.primary_concern}
    Wash frequency: ${userProfile.hair_care_routine.wash_frequency}
    Chemical history: ${userProfile.hair_care_routine.chemical_treatments.join(', ')}
    Product knowledge: ${userProfile.hair_care_routine.product_knowledge}

    Ingredients to analyze:
    ${ingredients.join(', ')}

    Context URLs:
    ${contextURLs.join('\n')}

    Output your analysis strictly in the following JSON format. Do not include any markdown formatting or extra text outside the JSON block.
    {
      "flagged_ingredients": [
        {
          "ingredient": "Ingredient Name",
          "flag": "restricted" | "aligned" | "attention" | "base" | "unrecognized",
          "description": "Brief, objective reasoning based on cosmetic literature and the user profile."
        }
      ]
    }`

        const response = ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: z.toJSONSchema(outputSchema),
            },
        });

        return response;
    }

    const startAnalysis = async () => {
        try {
            const userData = await fetchData();
            const result = await analyzeIngredients({
                ingredients: ingredients.split(',').map((item) => item.trim()),
                userProfile: userData,
                contextURLs: contextURLs,
            });

            const parsedResult = outputSchema.parse(JSON.parse(result.text));
            const recommendations = await generateRecommendations();
            parsedResult = parsedResult.concat(recommendations);
            return parsedResult;
        } catch (err) {
            ToastAndroid.show('An error occurred during analysis. ' + err.message, ToastAndroid.LONG);
            console.error('Error during analysis:', err);
            router.back();
        }
    }


    const generateProfileTagWeights = async () => {
        const userProfile = await fetchData();
        let profileWeights = {};
        let userProfileTags = [];
        for (const section in userProfile) {
            if (section === 'about_you') {
                continue;
            }
            for (const question in userProfile[section]) {
                if (Array.isArray(userProfile[section][question]) && userProfile[section][question].length < 1) {
                    continue;
                }
                if (question === 'chemical_treatments') {
                    for (const items of userProfile[section][question]) {
                        userProfileTags = userProfileTags.concat(profileTags[section][question][items]);
                    }
                } else {
                    const answer = userProfile[section][question];
                    userProfileTags = userProfileTags.concat(profileTags[section][question][answer]);
                }
            }
        }

        for (const tag of userProfileTags) {
            if (tag === 'Exfoliant') {
                const removeIndex = userProfileTags.indexOf(tag)
                if (removeIndex > -1) {
                    userProfileTags = userProfileTags.splice(removeIndex, 1)
                }
                userProfileTags = userProfileTags.concat(exfoliantNames);
            }
            if (tag === 'Emollient') {
                const removeIndex = userProfileTags.indexOf(tag)
                if (removeIndex > -1) {
                    userProfileTags = userProfileTags.splice(removeIndex, 1)
                }
                userProfileTags = userProfileTags.concat(emollientNames);
            }
            if (tag === 'Emulsifier') {
                const removeIndex = userProfileTags.indexOf(tag)
                if (removeIndex > -1) {
                    userProfileTags = userProfileTags.splice(removeIndex, 1)
                }
                userProfileTags = userProfileTags.concat(emulsifierNames);
            }
            if (tag === 'Skin Lightening') {
                const removeIndex = userProfileTags.indexOf(tag)
                if (removeIndex > -1) {
                    userProfileTags = userProfileTags.splice(removeIndex, 1)
                }
                userProfileTags = userProfileTags.concat(skinLighteningNames);
            }
            if (tag === 'Moisturizer') {
                const removeIndex = userProfileTags.indexOf(tag)
                if (removeIndex > -1) {
                    userProfileTags = userProfileTags.splice(removeIndex, 1)
                }
                userProfileTags = userProfileTags.concat(moisturizerNames);
            }
            if (tag === 'Retinoid') {
                const removeIndex = userProfileTags.indexOf(tag)
                if (removeIndex > -1) {
                    userProfileTags = userProfileTags.splice(removeIndex, 1)
                }
                userProfileTags = userProfileTags.concat(retinoidNames);
            }
            if (tag === 'Skin Restoring') {
                const removeIndex = userProfileTags.indexOf(tag)
                if (removeIndex > -1) {
                    userProfileTags = userProfileTags.splice(removeIndex, 1)
                }
                userProfileTags = userProfileTags.concat(skinRestoringNames);
            }
        }

        for (const tag of userProfileTags) {
            if (profileWeights[tag]) {
                profileWeights[tag] += 1
            } else {
                profileWeights[tag] = 1
            }
        }


        return profileWeights;

    }

    const generateRecommendations = async () => {
        const profileWeights = await generateProfileTagWeights();
        let rankedIngredients = [];

        //TODO: convert to fetch ingredients in a seperate function
        const queryOption = query(collection(db, 'ingredients_glossary'));

        const collectionSnapshot = await getDocs(queryOption);

        collectionSnapshot.forEach((doc) => {
            let ranking = 0;
            if (doc.data().ingredient_name === "Chemical X") {
                return; //NOTE: Skip chemical X from recommendations, its in DB
            }
            for (const category of doc.data().category) {
                if (profileWeights[category]) {
                    ranking += profileWeights[category]
                }
            }
            const rankedIngredient = {
                ingredient: doc.data().ingredient_name,
                flag: "recommended",
                ranking: ranking
            };
            rankedIngredients = [...rankedIngredients, rankedIngredient];
        })

        rankedIngredients.sort((a, b) => {
            if (a.ranking < b.ranking) return 1;
            if (a.ranking > b.ranking) return -1;
            return 0;
        });

        return rankedIngredients;
    }

    useEffect(() => {
        startAnalysis().then((res) => {
            //NOTE: for some reason, without this log it tries to route before the result even return, will investigate later
            console.log('Analysis result:', res);
            router.replace({
                pathname: 'scanner/results',
                params: {
                    name,
                    brand,
                    notes,
                    flaggedIngredients: JSON.stringify(res.flagged_ingredients),
                }
            });
        }).catch((err) => {
            ToastAndroid.show('An error occurred during analysis. ' + err.message, ToastAndroid.LONG);
            console.error('Error during analysis:', err);
            router.back();
        });
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <LottieView
                    style={{
                        aspectRatio: 1,
                        width: 600
                    }}
                    resizeMode='contain'
                    speed={1.5}
                    autoPlay
                    loop={true}
                    source={require('assets/lottie/flask-loading.json')}
                />
                <Text
                    style={{
                        position: 'absolute',
                        top: 400,
                        fontSize: 30,
                        fontWeight: 600,
                        color: Colors.textColor
                    }}
                >
                    Loading
                </Text>
            </View>
        </View>
    );
}
