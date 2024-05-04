# Import necessary Modules and Classes
from chatbot import Chatbot


# Initialize Chatbot and Start Interaction
def main():
    # Create an instance of the Chatbot Class
    chatbot = Chatbot()

    # Display a Welcome message and language selection
    print("Hello, Welcome to ChattyLinguaBot!")
    print("Please select a language : English or Swahili")
    language = input("Language (English/Swahili): ").lower()
    while True:
            language = input("Language (English/Swahili): ").lower()
            
            if language == "english":
                print("Hello, Welcome to ChattyLinguaBot!")
            elif language == "swahili":
                print("Habari Yako , Nakukaribisha Kwa ChattyLinguaBot!")
            else:
                print("Invalid language selection. Please select English or Swahili.")
    
    # 
    
    # Start Interaction
    while True:
        # Get User Input
        user_input = input("You: ")

        # Pass user input to the chatbot for processing
        response = chatbot.respond(user_input)

        # Display the response
        print("ChattyLinguaBot: ", response)

        # Check if the user wants to quit
        if user_input.lower() == "exit":
            break

    if __name__ == "__main__":
        main()


    

