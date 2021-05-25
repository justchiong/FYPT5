import subprocess
import glob, os

# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error
# cwd argument to change working directory

# get queries to run from backend server and put into this variable
queriesToRun = ['cwe079', 'cwe078', 'cwe089']

# get .ql filenames in the folder and put in a list
queryFiles = []
os.chdir("./standard-queries")
for file in glob.glob("*.ql"):
    queryFiles.append(file)
print(queryFiles)

# match the queriesToRun with which command to execute
def runQueries():
    print("test")

for query in queriesToRun:
    print(query)
