class utils:
    @staticmethod
    def validate_input(text):
        """
        validate user input to ensure it is not empty

        Args:
            text (str): user input
        Returns:
            bool: True if input is not empty, False otherwise
        """
        # Check if the input is empty after stripping whitespace
        if text.strip() == "":
            return False
        else:
            return True
    @staticmethod
    def format_text(text):
        """
        format text to be used in the chatbot

        Args:
            text (str): user input
        Returns:
            str: formatted text
        """
        return text.lower()
    
    @staticmethod
    def handle_exception(exception):
        """
        Handle exception gracefully and provide meaningdull
        error message

        Args:
            exception (Excpetion): Excpetion object

        Returns:
            str: error message

        """
        return f"An error occured: {exception}"