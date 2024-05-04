"""
This programm sends an email with a quote every monday
"""
import random
import smtplib
import datetime as dt

my_email = "huznigarane@gmail.com"
my_password = "mlrp bdtk urvd xecf"

now = dt.datetime.now()
weekday = now.weekday()

# le me test with wednesday since am coding wednesday
if weekday == 2:
    # open the quote file file
    with open("Birthday/quotes.txt") as quote_file:
        all_quotes = quote_file.readlines()
        quote = random.choice(all_quotes)
    
    with smtplib.SMTP("smtp.gmail.com", 587) as connection:
        connection.starttls()
        connection.login(user=my_email, password = my_password)
        connection.sendmail(
            from_addr=my_email,
            to_addrs=my_email,
            msg=f"subject:Monday Motivation\n\n{quote}")
    
