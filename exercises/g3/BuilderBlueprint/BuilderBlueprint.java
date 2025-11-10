import java.util.List;
import java.util.ArrayList;

// ============================================
// FILE: RegexBuilder.java
// ============================================
public interface RegexBuilder {
    void buildLiteral(String literal);
    void buildAnyCharacter();
    void buildDigit();
    void buildWhitespace();
    void buildWordCharacter();
    Regex getResult();
}

// ============================================
// FILE: Regex.java
// ============================================
class Regex {
    private StringBuilder pattern;

    public Regex() {
        pattern = new StringBuilder();
    }

    public Regex(List<String> component) {
        pattern = new StringBuilder();
        for(String c : component) {
            pattern.append(c);
        }
    }

    public String getPattern() {
        return pattern.toString();
    }

    @Override
    public String toString() {
        return getPattern();
    }
}

// ============================================
// FILE: ConcreteRegexBuilder.java
// ============================================
class ConcreteRegexBuilder implements RegexBuilder {
    private List<String> component = new ArrayList<>();

    @Override
    public void buildLiteral(String literal) {
        component.add(literal);
    }

    @Override
    public void buildAnyCharacter() {
        component.add(".");
    }

    @Override
    public void buildDigit() {
        component.add("\\d");
    }

    @Override
    public void buildWhitespace() {
        component.add("\\s");
    }

    @Override
    public void buildWordCharacter() {
        component.add("\\w");
    }

    @Override
    public Regex getResult() {
        return new Regex(component);
    }
}

// ============================================
// FILE: RegexDirector.java
// ============================================
class RegexDirector {
    private RegexBuilder builder;

    public void setBuilder(RegexBuilder builder) {
        this.builder = builder;
    }

    public Regex construct() {
        builder.buildLiteral("Hello");
        builder.buildWhitespace();
        builder.buildWordCharacter();
        builder.buildAnyCharacter();
        return builder.getResult();
    }
}