# Import necessary libraries/modules for API integration
import requests

class Translator:
    def __init__(self, api_key):
        """
        Initialize the Translator object with the API key.

        Args:
            api_key (str): API key for the translation service.
        """
        self.api_key = api_key
        self.translation_api_key = "https://translation.googleapis.com/language/translate/v2"


    def translate_text(self, text, source_language, target_language):
        """
        Translate text from one language to another using the chosen API.

        Args:
            text (str): Text to be translated.
            source_language (str): Source language of the text.
            target_language (str): Target language for translation.

        Returns:
            str: Translated text.
        """
        translated_text = None
        try:
            params = {

                'q': text,
                'source': source_language,
                'target': target_language,	
                'key': self.api_key
            }

            response = requests.get(self.translation_api_key, params=params)
            # raise exception for hhtps error
            response.raise_for_status()
            # parse JSON response and extract translated text
            data = response.json()
            if 'data' in data and 'translations' in data['data'] and data['data']['translations']:
                translated_text = data['data']['translations'][0]['translatedText']
            else:
                raise ValueError("Translation data not found in the response")
        except requests.RequestException as e:
            # Extract the translated text from the response
            translated_text = f"Translation failed: {e}"

        except ValueError as e:
            #Handle any exceptions that occur during translation
            translated_text = f"Translation failed: {e}"
        
        return translated_text
