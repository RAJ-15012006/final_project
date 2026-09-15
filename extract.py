import re
with open('paper/ieee_paper.html', 'r') as f:
    html = f.read()

# Extract all text between <p> and </p>, and <li> and </li>
tags = re.findall(r'<p>(.*?)</p>', html, re.DOTALL)
for i, tag in enumerate(tags[:5]):
    print(f"P{i}: {tag[:100]}...")
