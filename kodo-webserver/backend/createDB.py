import subprocess
import zipfile
import sys
import zipfile
import os
import removeReq
# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error
# cwd argument to change working directory

# get the folder name and put in this variable to create DB of it

uuid = sys.argv[1]
parent_dir = os.path.dirname(os.path.realpath(__file__)) + "/webServer_Folders"

queriesToRun = sys.argv[2].split(",")
email = sys.argv[3]

dirPath = os.path.join(parent_dir, uuid)
destPath = parent_dir + '/' + uuid
os.mkdir(dirPath)

print("Directory '% s' created" % uuid)

csvList = []

zipPath = os.path.dirname(os.path.realpath(__file__)) + "/zipFiles/" + uuid +".zip"
with zipfile.ZipFile(zipPath, 'r') as zip_ref:
     zip_ref.extractall(destPath)

cmd = f"codeql database create ./backend/databases/{uuid}_db --source-root=./backend/webServer_Folders/{uuid} --language=javascript"
print("Creating database...")
process1= subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE)
print(process1.returncode)
print(process1.stderr)
print(process1.stdout)
print("CodeQL Database Created.")

result_parent_dir = os.path.dirname(os.path.realpath(__file__)) + "/scanResults"

scanResultFolderName = uuid + '_scanResults'
scanResultFolderPath = f"./backend/scanResults/{scanResultFolderName}"

resultPath = os.path.join(result_parent_dir, scanResultFolderName)
os.mkdir(resultPath)

databaseName = uuid +"_db"

# get .ql filenames in the folder and put in a list
for query in queriesToRun:
     cweList = []
     if query == "injection":
          cweList = ["CWE-089"]

     elif query == "ba":
          cweList = ["MISSING QUERY FILE"]
     #Missing Some CWEs Check OWASP Website

     elif query == "sde":
          cweList = ["CWE-312", "CWE-327"]
     #Missing Some CWEs Check OWASP Website

     elif query == "xxe":
          cweList = ["CWE-611"]

     elif query == "bac":
          cweList = ["CWE-022"]
     #Missing Some CWEs Check OWASP Website

     elif query == "sm":
          cweList = ["MISSING QUERY FILE"]
     #Missing Some CWEs Check OWASP Website

     elif query == "xss":
          cweList = ["CWE-079"]
     #Missing Some CWEs Check OWASP Website

     elif query == "id":
          cweList = ["CWE-502"]
     #Missing Some CWEs Check OWASP Website

     elif query == "ilm":
          cweList = ["MISSING QUERY FILE"]
     #Missing Some CWEs Check OWASP Website
     for cwe in cweList:
          print("Scanning database for " + cwe)
          cmd = f"codeql database analyze --format=csv --output={scanResultFolderPath}/{query}_result_{cwe}.csv --threads=4 --ram=8000 --no-rerun ./backend/databases/{databaseName} ../CodeQL-home/vscode-codeql-starter/ql/javascript/ql/src/Security/{cwe}"
          csvList.append(f"{scanResultFolderPath}/{query}_result_{cwe}.csv")    
          process2= subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE)
          print(process2.returncode)
          print(process2.stderr)
          print(process2.stdout)
     print("scanning completed! Now deleting request database, folder and zip file...")

removeReq.deleteFiles(uuid)
 
