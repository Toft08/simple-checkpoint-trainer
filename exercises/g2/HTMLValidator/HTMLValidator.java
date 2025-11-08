import java.util.Stack;

public class HTMLValidator {
    public boolean validateHTML(String html) {
        Stack<String> stack = new Stack<>();

        String tagPattern = "<(/?)(html|body|div|p|b|i|h1|h2)>";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(tagPattern);
        java.util.regex.Matcher matcher = pattern.matcher(html);

        while (matcher.find()) {
            String slash = matcher.group(1); 
            String tagName = matcher.group(2);

            if (slash.isEmpty()) {
                stack.push(tagName);
            } else {
                if (stack.isEmpty() || !stack.peek().equals(tagName)) {
                    return false; 
                }
                stack.pop();
            }
        }

        return stack.isEmpty();
    }
}