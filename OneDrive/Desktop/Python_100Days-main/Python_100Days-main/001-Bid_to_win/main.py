from replit import clear
#HINT: You can call clear() to clear the output in the console.
from art import logo
print(logo)

bidders = []
bid = []

def find_highest_bidder(bidders, bid):
  highest_bid_index = bid.index(max(bid))
  winner_name = bidders[highest_bid_index]
  winning_bid = bid[highest_bid_index]
  print(f"The winner is {winner_name} with a bid of ${winning_bid}")

while True:
  name = input("What is your name? ").lower()
  bid_price = float(input("What is your bid price? $"))
  bidders.append(name)
  bid.append(bid_price)
  other_users =  input("Are there other users who want to bid? Type 'yes' or 'no' ").lower()

  if other_users == "no":
    find_highest_bidder(bidders, bid)
    break
  clear() #clear the console for the  next bidder
