import subprocess
import glob, os

# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error
# cwd argument to change working directory

# get queries to run from backend server and put into this variable
queriesToRun = ['CWE-079', 'CWE-078', 'CWE-089']

# get .ql filenames in the folder and put in a list
count = 0
for query in queriesToRun:
    count = count+1
    queryFiles = []
    if count >1:
        os.chdir(f"../{query}")
    else:
        os.chdir(f"./standard-queries/{query}")
    for file in glob.glob("*.ql"):
        queryFiles.append(file)
    print(queryFiles)

# match the queriesToRun with which command to execute
def runQueries():
    print("test")


