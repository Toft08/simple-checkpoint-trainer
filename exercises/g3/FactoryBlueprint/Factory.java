public class Factory {
    public Product createProduct(String type) {
        if ("A".equals(type)) {
            return new ConcreteProductA();
        } else if ("B".equals(type)) {
            return new ConcreteProductB();
        }
        return null;
    }
}

// ============================================
// FILE: ConcreteProductA.java
// ============================================
public class ConcreteProductA implements Product {
    @Override
    public void showDetails() {
        System.out.println("This is ConcreteProductA.");
    }
}
// ============================================
// FILE: ConcreteProductB.java
// ============================================
public class ConcreteProductB implements Product {
    @Override
    public void showDetails() {
        System.out.println("This is ConcreteProductB.");
    }
}