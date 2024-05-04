
from data_handler import DataHandler
from translator import Translator
from utility import utils
from config import Config

config = Config()

class Chatbot:
    def __init__(self):
        """
        Initializes a new instance of the Chatbot class.

        This constructor method does not take any parameters. It is responsible for initializing the Chatbot object and loading the chatbot data.

        Parameters:
            None

        Returns:
            None
        """
        # Load the chatbot data
        pass

    def translate_text(self, text, source_language, target_language):
        """
        Translates the given text from the source language to the target language using the Google Translate API.

        Args:
            text (str): The text to be translated.
            source_language (str): The source language of the text.
            target_language (str): The target language for translation.

        Returns:
            str: The translated text.
        """
        translator = Translator(config.TRANSLATION_API_KEY)
        translated_text = translator.translate_text(text, "en", target_language)

        return translated_text
    def Introduction(self):
        """
        Returns a string prompting the user to choose their preferred language.
        :return: A string with the language selection prompt.
        :rtype: str
        """

        return "Welcome To ChattyLingua! Please follow the prompts to inergrate with me"
    
    def language_selection(self):
        """
        Returns a string prompting the user to choose their preferred language.
        
        :return: A string with the language selection prompt.
        :rtype: str
        """
        return "Please choose your prefered language: ! English 2. Swahili"
    
    def user_data_collection(self):
        """
        Collects user data by prompting the user for their name, gender, age, and location.
        
        Returns:
            dict: A dictionary containing the user's name, gender, age, and location.
        """
        name = input("chatbot: Whats your name? ")
        gender = input("chatbot: Whats your gender? ")
        age = input("chatbot: Whats your age? ")
        location = input("chatbot: Whats your location? ")


        # store the collected data in dictionary
        user_data = {
            "name": name,
            "gender": gender,
            "age": age,
            "location": location}
        
        return user_data
    
    def greeting_users(self, user_data):
        """
        Personalize greeting message based on the collected
        user data
        """
        greeting = print(f"chatbot: hello {user_data['name']}! Nice to meet you! How can I assist you today?")
        return greeting
    
    def task_execution(self, user_input):
         """Performing simple tasks such as echoing the user input"""
         return user_input
    
    def translation(self, text, target_language):
        """Translate to the specified target language  """
        # Implement your translation logic here
        pass