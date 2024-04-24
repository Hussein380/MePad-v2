
from datetime import datetime
import pandas
import random
import smtplib
my_email = "huznigarane@gmail.com"
password = "mlrp bdtk urvd xecf"
# 2. Check if today matches a birthday in the birthdays.csv
today = datetime.now()
today_tuple = (today.month, today.day)


# HINT 2: Use pandas to read the birthdays.csv
data = pandas.read_csv("birthday.csv")
birthdays_dict ={
    (data_row["month"],
     data_row["day"]): data_row 
     for (index, data_row) in data.iterrows()
     }


#HINT 4: Then you could compare and see if today's month/day tuple matches one of the keys in birthday_dict like this:
if today_tuple in birthdays_dict:
    birthday_person = birthdays_dict[today_tuple]
    file_path = f"letter_templates/letter_{random.randint(1, 3)}.txt"
    with open(file_path) as letter_file:
        content = letter_file.read()
        content = content.replace("[Name]", birthday_person["name"])
    
    with smtplib.SMTP("smtp.gmail.com") as connection :
        connection.starttls()
        connection.login(my_email, password)
        connection.sendmail(
            from_addr=my_email,
            to_addrs=birthday_person["email"],
            msg=f"Subject:Happy Birthday!\n\n{content}"
        
        )


