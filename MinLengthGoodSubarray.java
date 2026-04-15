import java.util.HashMap;
import java.util.Map;

public class MinLengthGoodSubarray {
    
    /**
     * Leiab minimaalse pikkusega alamjada, mis sisaldab vähemalt k erinevat täisarvu.
     * Kui sellist alamjada ei leita, tagastab -1.
     * 
     * @param arr positiivsete täisarvude massiiv
     * @param k minimaalne arv erinevaid täisarve, mis peavad alamjadas olema
     * @return minimaalse pikkusega alamjada pikkus või -1, kui sellist ei leita
     */
    public static int minLengthGoodSubarray(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0) {
            return -1;
        }
        
        int n = arr.length;
        int minLength = Integer.MAX_VALUE;
        Map<Integer, Integer> countMap = new HashMap<>();
        int left = 0;
        
        // Kasutame libisevat akent (sliding window)
        for (int right = 0; right < n; right++) {
            // Lisame parempoolse elemendi aknasse
            countMap.put(arr[right], countMap.getOrDefault(arr[right], 0) + 1);
            
            // Kui meil on vähemalt k erinevat täisarvu, proovime akent vähendada
            while (countMap.size() >= k) {
                // Uuendame minimaalset pikkust
                minLength = Math.min(minLength, right - left + 1);
                
                // Eemaldame vasakpoolse elemendi ja proovime akent vähendada
                int leftValue = arr[left];
                int count = countMap.get(leftValue);
                if (count == 1) {
                    countMap.remove(leftValue);
                } else {
                    countMap.put(leftValue, count - 1);
                }
                left++;
            }
        }
        
        // Kui leidsime sobiva alamjada, tagastame minimaalse pikkuse, muidu -1
        return minLength == Integer.MAX_VALUE ? -1 : minLength;
    }
    
    // Testmeetod näitamiseks
    public static void main(String[] args) {
        // Test 1: [1, 2, 3, 4, 5], k = 3
        // Oodatud: 3 (alamjada [1, 2, 3])
        int[] arr1 = {1, 2, 3, 4, 5};
        System.out.println("Test 1: " + minLengthGoodSubarray(arr1, 3)); // Oodatud: 3
        
        // Test 2: [1, 2, 2, 3, 1], k = 2
        // Oodatud: 2 (alamjada [2, 3] või [3, 1])
        int[] arr2 = {1, 2, 2, 3, 1};
        System.out.println("Test 2: " + minLengthGoodSubarray(arr2, 2)); // Oodatud: 2
        
        // Test 3: [1, 1, 1, 1], k = 2
        // Oodatud: -1 (ei ole piisavalt erinevaid täisarve)
        int[] arr3 = {1, 1, 1, 1};
        System.out.println("Test 3: " + minLengthGoodSubarray(arr3, 2)); // Oodatud: -1
        
        // Test 4: [1, 2, 3, 1, 2], k = 3
        // Oodatud: 3 (alamjada [1, 2, 3] või [2, 3, 1])
        int[] arr4 = {1, 2, 3, 1, 2};
        System.out.println("Test 4: " + minLengthGoodSubarray(arr4, 3)); // Oodatud: 3
    }
}



