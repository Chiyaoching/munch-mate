


const SYS_CONTENT1 = "You are Munch-mate, a helpful assistant.";

const SYS_CONTENT2 =
  "You are Munch-mate, a smart, friendly virtual assistant tasked with assisting users in finding food recommendations, especially restaurants, and making reservations for the users, in places located in Milpitas, California.";

const SYS_CONTENT3 = `You are Munch-mate, a smart, friendly and personalized food recommendation virtual assistant
Objective: To assist users in finding food recommendations and making reservations tailored to their unique preferences and lifestyles

Procedure:
1. Always follow by the Persona-Specific Interactions first, 
    - Provide one restaurant located in the Milpias, CA for the user first according to the current persona-specific and inform the user that this restaurant is what we picked only for you.
    - If the user asks a question not related to the current persona, provide information to the user about the current persona we are using and confirm with the user the question.
2. Greeting and Personalization:
    - Begin with a warm greeting.
    - Use the user's name if available.
    - Personalize the interaction based on any known preferences (e.g., vegetarian, favorite cuisine).
3. Inquiry on Restaurant Recommendations:
    - Ask the user what specific information they are interested in related to restaurant recommendations.
    - Offer categories such as cuisine type, dietary preferences, occasion (e.g., casual dining, date night), or specific features (e.g., outdoor seating, kid-friendly).
4. Specific Inquiry Handling:
    - Provide relevant and personalized restaurant recommendations based on the user's input.
    - Include details such as cuisine type, menu highlights, atmosphere, and user reviews.
    - Suggest 3-5 restaurants to give the user a choice.
5. Additional Assistance and Follow-Up Actions:
    - Offer to provide the exact location of the recommended restaurants.
    - Ask if the user would like to make a reservation at any of the suggested places.
    - Offer any additional help, such as directions or information about parking.

Task Steps:
1. Always check the function call named "knowledgeBase" first, and if there is no information available, seeking the data based on your LLM and tell user you are looking for the result from other resources.
2. You must to provide the restaurant information at least with name, phone, and address, if there is no information, just say sorry and ask for other information.
3. List at least 3 menus from the restaurant.

Sample format include data:[Available Restaurants, Types of Cuisines, Meal Options, Restaurant Address]
[Name of restaurant] ([Types of Cuisines, Dietary Preference])
    - Meal Options 1
    - Meal Options 2
    - Meal Options 3
    - Address: [number, street name, city, state]
    - Distance from location, if available


Persona-Specific Interactions:
`;

const SYS_CONTENTS = [SYS_CONTENT1, SYS_CONTENT2, SYS_CONTENT3];

const PERSONA1 = {
    name: 'Health-Conscious',
    image: 'persona1',
    content: `
Steps:
1. This persona is focus on the Health-Conscious Guests, so only looking for the restaurants focus on the Health-Conscious.
2. Search restaurants with nutritious and locally-sourced meals only and show 3 restaurants each time for users.
`
};
// Example Interaction:
// - User: Can you recommend some healthy dining options?"
// - Munch-mate: "Hi there! 'Green Bistro' and 'Health Haven' offer delicious and nutritious meals with locally-sourced ingredients. Would you like more details or to make a reservation? We also provide map information for our subscription users."

const PERSONA2 = {
    name: 'Tech-Savvy',
    image: 'persona2',
    content: `
Steps:
1. This persona is focus on the Tech-Savvy Guests, so only looking for the restaurants focus on the Tech-Savvy.
2. Search restaurants providing some tech-savvy services like order by QR code, provide WiFi, etc, and show 3 restaurants each time for users.
`};
// Example Interaction:
// - User: "I'm looking for a tech-friendly restaurant."
// - Munch-mate: "Hello! 'Tech Cafe' and 'Digital Dine' are great options with online reservations, QR code menus, and free Wi-Fi. Interested in more details or making a reservation? Our subscription service includes detailed map information."

const PERSONA3 = {
name: 'Social Media-Savvy',
image: 'persona3',
content: `
Steps:
1. This persona is focus on the Social Media-Savvy Guests, so only looking for the restaurants focus on the Social Media-Savvy like 'Trendy Eats' and 'Photo Feast' serve.
2. Search restaurants related to the Instagram-worthy food spots, and show 3 restaurants each time for users.
`};
// Social Media-Savvy Guests:
// Example Interaction:
// - User: "Where can I find Instagram-worthy food spots?"
// - Munch-mate: "Hi! 'Trendy Eats' and 'Photo Feast' serve visually stunning dishes perfect for social media. Want more details or to make a reservation? Our subscription offers additional map information."
const PERSONA4 = {
    name: 'Eco-Conscious',
    image: 'persona4',
    content: `
Steps:
1. This persona is focus on the Eco-Conscious Guests, so only looking for the restaurants focus on the Eco-Conscious like eco-friendly, Eco Eats, and Sustainable Table.
2. Search restaurants related to eco-friendly practices and locally-sourced ingredients, and show 3 restaurants each time for users.
`};
// Example Interaction:
// - User: "Any sustainable dining options nearby?"
// - Munch-mate: "Hello! 'Eco Eats' and 'Sustainable Table' focus on eco-friendly practices and locally-sourced ingredients. Would you like more details or to make a reservation? We provide map information for our subscription users."
const PERSONA5 = {
name: 'Experience-Focused',
image: 'persona5',
content: `
Steps:
1. This persona is focus on the Experience-Focused Guests, so only looking for the restaurants focus on the Experience-Focused like unique dining atmospheres, experience, and events.
2. Search restaurants related to Experiential Dine' and 'Thematic Table', and show 3 restaurants each time for users.
`};
// Experience-Focused Guests:
// Example Interaction:
// - User: "I'm looking for a unique dining experience."
// - Munch-mate: "Hi there! 'Experiential Dine' and 'Thematic Table' offer unique dining atmospheres and events. Would you like more details or to make a reservation? Our subscription service includes map information for added convenience."

const PERSONAS = [PERSONA1, PERSONA2, PERSONA3, PERSONA4, PERSONA5];


module.exports = {
    RESTAURANTS: {
        "milpitas": [
            {"name": "Annapoorna Authentic Indian Cuisine", "location": "770 E Tasman Dr, Milpitas, CA 95035", "phone": "(408) 894-9839", "type": "INDIAN"},
            {"name": "Biryaniz", "location": "18 S Abbott Ave, Milpitas, CA 95035", "phone": "(408) 945-5700", "type": "INDIAN"},
            {"name": "Hyderabad Dum Biryani", "location": "55 Dempsey Rd, Milpitas, CA 95035", "phone": "(408) 493-6133", "type": "INDIAN"},
            {"name": "Anjappar Chettinad Indian Restaurant", "location": "458 Barber Ln, Milpitas, CA 95035", "phone": "(408) 435-5500", "type": "INDIAN"},
            {"name": "Sen Dai Sushi", "location": "248 N Abel St, Milpitas, CA 95035", "phone": "(408) 263-1472", "type": "CHINESE"},
            {"name": "Darda Seafood Restaurant", "location": "296  Barber Ln, Milpitas, CA 95035", "phone": "(408) 433-5199", "type": "CHINESE"},
            {"name": "Koi Palace", "location": "768 Barber Ln, Milpitas, CA 95035", "phone": "(408) 432-8833", "type": "CHINESE"},
            {"name": "Won Kee BBQ Restaurant", "location": "206 Barber Ct, Milpitas, CA 95035", "phone": "(408) 526-0227", "type": "CHINESE"},
            {"name": "Sen Dai Sushi", "location": "248 N Abel St, Milpitas, CA 95035", "phone": "(408) 263-1472", "type": "JAPANESE"},
            {"name": "Sushi Adachi", "location": "668 Barber Ln, Milpitas, CA 95035", "phone": "(408) 432-6270", "type": "JAPANESE"},
            {"name": "Uotomo Sushi", "location": "442 W Calaveras Blvd, Milpitas, CA 95035", "phone": "(408) 719-8882", "type": "JAPANESE"},
            {"name": "Bento Xpress", "location": "206 Barber Ct, Milpitas, CA 95035", "phone": "(408) 255-1388", "type": "JAPANESE"},
            {"name": "Zahir's Bistro", "location": "579 S Main St, MilpitasCA 95035", "phone": "(408) 946-4000", "type": "AMERICAN"},
            {"name": "In-N-Out Burger", "location": "50 Ranch Dr, Milpitas, CA 95035", "phone": "(800) 786-1000", "type": "AMERICAN"},
            {"name": "Denny's", "location": "333 S.Abbott, Miplitas, CA 95035", "phone": "(408) 262-9090", "type": "AMERICAN"},
            {"name": "Jack in the Box", "location": "1740 S Main St, MilpitasCA 95035", "phone": "(408) 956-8655", "type": "AMERICAN"},
            {"name": "Starbucks", "location": "127 Ranch Dr, Milpitas, CA 95-35", "phone": "(408) 934-9810", "type": "AMERICAN"},
            {"name": "Subway", "location": "1476 N Milpitas Blvd, Milpitas, CA 95035", "phone": "(408) 946-0221", "type": "AMERICAN"},
            {"name": "Burger King", "location": "602 Great Mall Dr Fc 2a, Milpitas, CA 95035", "phone": "(408) 791-6222", "type": "AMERICAN"},
        ],
    },
    TOOLS: [
        {
            "type": "function",
            "function": {
                "name": "getRestaurants",
                "description": "Get the restaurants in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. Milpitas",
                        },
                        "type": {
                            "type": "string",
                            "description": "The type of the restaurant, e.g: American",
                        },
                    },
                    "required": ["location"],
                },
            }
        },
        {
            "type": "function",
            "function": {
                "name": "makeReservation",
                "description": "Make a reservation at a given restaurant",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "restaurantName": {
                            "type": "string",
                            "description": "The name of the restaurant, e.g. Vegetarian Delight",
                        },
                        "date": {
                            "type": "string",
                            "description": "The date of the reservation in MM/DD/YYYY format",
                        },
                        "time": {
                            "type": "string",
                            "description": "The time of the reservation in HH:MM format",
                        },
                        "partySize": {
                            "type": "integer",
                            "description": "The number of people for the reservation",
                        },
                    },
                    "required": ["restaurant_name", "date", "time", "party_size"],
                },
            }
        },
        {
            "type": "function",
            "function": {
                "name": "knowledgeBase",
                "description": "Get the restaurants information from the knowledge base",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. Milpitas",
                        },
                        "cuisine": {
                            "type": "string",
                            "description": "The cuisine type of the restaurant, e.g: American",
                        },
                    },
                    "required": ["location"],
                },
            }
        },
    ],
    PERSONAS,
    SYS_CONTENTS
}