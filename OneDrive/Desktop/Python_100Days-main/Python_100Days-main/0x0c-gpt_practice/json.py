"""Create a Python class called Book with the following attributes:

title: The title of the book (a string).
author: The author of the book (a string).
year: The year the book was published (an integer).
"""
import json

class Book:

    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year


    def serialize(obj, file_path):
        with open(file_path, "w") as file
            json.dump(obj.__dict__, file)

    @staticmethod
    def deserialize(file_path):
        with open(file_path, "r") as file:
            information = json.load(file)
            return Book(information['title', 'author'], information['year'])


    """ Create the instance"""
Book_instance = book("To kill a Mockingbird", "Harper Lee", 1960)

Book_instance.serialize(Book, "book.json")

deserialize_person(Book.deserialize("book.json"))


print(deserialize_person.title)
print(deserialize_person.author)
print(deserialize_person.year)
list