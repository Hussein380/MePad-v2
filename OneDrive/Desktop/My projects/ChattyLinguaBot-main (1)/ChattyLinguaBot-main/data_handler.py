import csv
import os

class DataHandler:
    def __init__(self, csv_file):
        """
        Initialize the DataHandler object witht the path to the csv
        Args:
            csv_file(str): path to the csv file
        
        """
        self.csv_file = csv_file

    def save_user_data(self, user_data):
        """
        Write data to the CSV file, handling file creation if 
        necessarry
        Args:
            user_data(dict): dictionary of user data

        """ 

        # Define fiels names for csv file
        fieldname = ["name", "gender", "age", "location"]
        try:
            # Check if the CSV file exists; if not, create it with headers
            file_exists = os.path.isfile(self.csv_file)
            # open csv file in append mode
            with open(self.csv_file, 'a', newline='') as file:
                # create a csv DictWriter object
                writer = csv.DictWriter(file, fieldnames=fieldname)
                # Witer headers of the file is empty
                if file.tell() == 0:
                    writer.writeheader()
                # write user data to csv file
                writer.writerow(user_data)
        except Exception as e:
            # Handle any errors that occur during file writing
            print(f"Error saving user data: {e}")

    def load_user_data(self):
        """
        Read user data from the csv file and return it as a dictionary
        Returns:
            dict: list of dictionary containing user data

        """
        user_data_list = []
        try:


            # open the csv file in read mode
            with open(self.csv_file, 'r') as file:
                # create a csv DictReader object
                reader = csv.DictReader(file)
                # iterate over each row in the csv file
                for row in reader:
                    # append each row to the user_data_list
                    user_data_list.append(dict(row))
        except IOError as e:
            # Handle any errors that occur during file reading
            print(f"Error loading user data: {e}")
        return user_data_list
