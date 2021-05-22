import subprocess

# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error
# cwd argument to change working directory

# get the folder name and put in this variable to create DB of it
folderName = "testFolder"

filePath = f"codeql database create --language=javascript --source-root ./{folderName} ../databases/{folderName}_DB"
process1= subprocess.run(filePath, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE, cwd="./kodo-webserver/kodo-backEnd/zipFiles")
print(process1.returncode)
print(process1.stderr)
print(process1.stdout)
