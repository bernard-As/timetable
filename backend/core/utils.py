from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

# print(Fore.RED + "This is red text")
# print(Fore.GREEN + "This is green text")
# print(Fore.YELLOW + "This is yellow text")
# print(Fore.BLUE + "This is blue text")
# print(Style.BRIGHT + "This is bright text")
# print(Style.DIM + "This is dim text")

def logger(text,x=0):
    if(x==0):
        print(text)
    elif(x==1):
        print(Fore.GREEN + text)
    elif(x==-1):
        print(Fore.RED + text)
    elif(x==2):
        print(Fore.BLUE + text)