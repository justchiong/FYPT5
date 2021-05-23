import subprocess

# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error
# cwd argument to change working directory

# get queries to run from backend server and put into this variable
queriesToRun = ['sqli', 'cmdi', 'xss']

# get .ql file's querys from folder(custom-queries)


# match the queriesToRun with which command to execute
for query in queriesToRun:
    print("test")
