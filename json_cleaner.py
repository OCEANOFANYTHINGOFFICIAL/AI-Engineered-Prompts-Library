import json

# Read the contents of the original prompts.json file
with open('prompts.json', 'r', encoding='UTF-8') as file:
    data = json.load(file)

# Remove the "authorname" and "authorurl" fields from each prompt
for prompt in data:
    prompt.pop('AuthorName', None)
    prompt.pop('AuthorURL', None)
    prompt.pop('RevisionTime', None)

# Save the modified data to a new file called new_prompts.json
with open('new_prompts.json', 'w') as file:
    json.dump(data, file)