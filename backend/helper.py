import random

def generate_room_name():
    # Lists of adjectives and animal names to combine
    adjectives = ['brave', 'clever', 'swift', 'mighty', 'gentle', 'curious', 'loyal', 'wild', 'bold', 'wise']
    animals = ['tiger', 'elephant', 'panda', 'fox', 'eagle', 'wolf', 'dolphin', 'lion', 'hawk', 'leopard']

    # Select a random adjective and animal
    adjective = random.choice(adjectives)
    animal = random.choice(animals)

    # Combine them to create the room name
    room_name = f"{adjective}-{animal}"
    
    return room_name