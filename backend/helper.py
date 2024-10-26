import random

def generate_room_name():
    # Lists of adjectives and animal names to combine
    adjectives = ["Brave", "Clever", "Swift", "Mighty", "Gentle", "Curious", "Loyal", "Wild", "Bold", "Wise"]
    animals = ["Tiger", "Elephant", "Panda", "Fox", "Eagle", "Wolf", "Dolphin", "Lion", "Hawk", "Leopard"]

    # Select a random adjective and animal
    adjective = random.choice(adjectives)
    animal = random.choice(animals)

    # Combine them to create the room name
    room_name = f"{adjective}_{animal}"
    
    return room_name