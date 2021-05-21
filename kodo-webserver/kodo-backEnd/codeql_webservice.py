import subprocess
from typing import Text

# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error

process1= subprocess.run("dir", shell=True, stdout=subprocess.PIPE, text=True)
print(process1.stdout)