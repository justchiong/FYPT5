import subprocess
import glob, os

# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error
# cwd argument to change working directory

# get queries to run from backend server and put into this variable
queriesToRun = ['CWE-089', 'CWE-078', 'CWE-089']
# get database name
databaseName = "dvna_DB"


# get .ql filenames in the folder and put in a list
count = 0
for query in queriesToRun:
    print(os.getcwd())
    #cmd = f"codeql database run-queries --threads=3 --ram=8000 ./kodo-webserver/backend/databases/{databaseName} ./standard-queries/{query}"
    #cmd = f"codeql database run-queries --threads=3 --ram=8000 ./kodo-webserver/backend/databases/{databaseName} CodeQL-home/vscode-codeql-starter/ql/javascript/ql/src/Security/{query}"
    cmd = f"codeql database analyze --format=csv --output=./kodo-webserver/backend/databases/{databaseName}/results/codeql-javascript/Security/{query}/{databaseName}_{query}_result.csv --threads=4 --ram=8000 --no-rerun ./kodo-webserver/backend/databases/{databaseName} CodeQL-home/vscode-codeql-starter/ql/javascript/ql/src/Security/{query}"
    process1= subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE)
    print(process1.returncode)
    print(process1.stderr)
    print(process1.stdout)



