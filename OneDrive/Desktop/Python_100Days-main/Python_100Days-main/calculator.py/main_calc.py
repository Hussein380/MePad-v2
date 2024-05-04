def add(n1, n2):
    return n1 + n2

def subtract(n1, n2):
    return n1- n2
      
def mulltiply(n1, n2):
    return n1 * n2

def divide(n1, n2):
    return n1 / n2

def calculator():
    operations = {"+": add, "-": subtract, "*": mulltiply, "/": divide}
    should_continue = True
    while (should_continue):
        num1 = float(input("What's the first number?: "))
        num2 = float(input("What's the second number?: "))
        for key in operations:
            print(key)
            operation_symbol = ("Pick an operation from the line above: ")
            calculation_function = operations[operation_symbol]
            answer = calculation_function(num1, num2)
            print(f"{num1} {operation_symbol} {num2} = {answer}")
            opinion = input("Enter y to continue or N to exit ").lower()
            if opinion == "y":
                num1 = answer
            else:
                should_continue = False
                calculator()
calculator()
