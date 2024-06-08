
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
        "san jose": [
            {"name": "fake name", "location": "just in san jose", "phone": "123456789"},
        ]
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
        }
    ]
}