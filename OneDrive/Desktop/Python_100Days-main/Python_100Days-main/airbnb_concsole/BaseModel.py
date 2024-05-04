#!/usr/bin/python3
"""
Module for the Base Class
-Public instance attributes
    -id
    -created_at
    -updated_at
-public instance methods
    save(self) - updates the updated_at attibutes
    - to_dict(self) - returns dictionary
- __str__method to print
"""
import uuid
from datetime import datetime

class BaseModel:
    """
    This is the base model class
    It is an abstract class from which all other classes would from 
    """
    id - str(uuid.uuid4())
    created_at = datetime.now()
    updated_at datetime.now()

    def __str__(self):
        """ Returns a string representation of the object class"""
        return "[{}] ({}) {}".format(self.__class__.__name__,
                                      self.id, self.__dict__)
    def save(self):
        """
        Updates the public instance attribute update_at
        with the current datetime
        """
        self.update_at = datetime.now()

    def to_dict(self):
        """
        Returns a dictionary containing key/value of __dict for an instance
        """
        obj_dict = self.__dict__.copy()

        obj_dict['__class__'] = self.__class__.__name__
        obj_dict['created_at'] = self.created_at.isoformat()
        obj_dict['updated_at'] = self.updated_at.isoformat()
        return obj_dict
