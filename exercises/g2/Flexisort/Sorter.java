public abstract class Sorter {
    private int[] array;

    public int[] getArray() {
        return array;
    }

    public void setArray(int[] array) {
        this.array = array;
    }

    public abstract void sort();
}

// ============================================
// FILE: BubbleSort.java
// ============================================
public class BubbleSort extends Sorter {
    @Override
    public void sort() {
        int[] arr = getArray();
        int n = arr.length;
        
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            // If no swapping occurred, the array is already sorted
            if (!swapped) {
                break;
            }
        }
    }
}

// ============================================
// FILE: InesertionSort.java
// ============================================
public class InsertionSort extends Sorter {
    @Override
    public void sort() {
        int[] arr = getArray();
        int n = arr.length;

        // Classic insertion sort (no early break)
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;

            // Shift elements that are larger than key
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }

            arr[j + 1] = key;
        }
    }
}
