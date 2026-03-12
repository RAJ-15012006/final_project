export const problems = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    topics: ['Array', 'Hash Table'],
    description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.<br/><br/>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.<br/><br/>You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' }
    ],
    boilerplate: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // TODO: Implement logic here\n        return new int[]{};\n    }\n}`
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topics: ['String', 'Stack'],
    description: `Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.<br/><br/>An input string is valid if:<br/>1. Open brackets must be closed by the same type of brackets.<br/>2. Open brackets must be closed in the correct order.<br/>3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    boilerplate: `class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}`
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topics: ['Hash Table', 'String', 'Sliding Window'],
    description: `Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3' },
      { input: 's = "bbbbb"', output: '1' },
      { input: 's = "pwwkew"', output: '3' }
    ],
    boilerplate: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}`
  },
  {
    id: '4',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    topics: ['Array', 'Binary Search', 'Divide and Conquer'],
    description: `Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return the <strong>median</strong> of the two sorted arrays.<br/><br/>The overall run time complexity should be <code>O(log (m+n))</code>.`,
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000' }
    ],
    boilerplate: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        \n    }\n}`
  },
  {
    id: '5',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    topics: ['String', 'Dynamic Programming'],
    description: `Given a string <code>s</code>, return the longest <strong>palindromic substring</strong> in <code>s</code>.`,
    examples: [
      { input: 's = "babad"', output: '"bab"' },
      { input: 's = "cbbd"', output: '"bb"' }
    ],
    boilerplate: `class Solution {\n    public String longestPalindrome(String s) {\n        \n    }\n}`
  },
  {
    id: '6',
    title: 'Zigzag Conversion',
    difficulty: 'Medium',
    topics: ['String'],
    description: `The string <code>"PAYPALISHIRING"</code> is written in a zigzag pattern on a given number of rows like this...`,
    examples: [
      { input: 's = "PAYPALISHIRING", numRows = 3', output: '"PAHNAPLSIIGYIR"' }
    ],
    boilerplate: `class Solution {\n    public String convert(String s, int numRows) {\n        \n    }\n}`
  },
  {
    id: '7',
    title: 'Reverse Integer',
    difficulty: 'Medium',
    topics: ['Math'],
    description: `Given a signed 32-bit integer <code>x</code>, return <code>x</code> with its digits reversed. If reversing <code>x</code> causes the value to go outside the signed 32-bit integer range <code>[-231, 231 - 1]</code>, then return <code>0</code>.`,
    examples: [
      { input: 'x = 123', output: '321' },
      { input: 'x = -123', output: '-321' },
      { input: 'x = 120', output: '21' }
    ],
    boilerplate: `class Solution {\n    public int reverse(int x) {\n        \n    }\n}`
  },
  {
    id: '8',
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    topics: ['String'],
    description: `Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer.`,
    examples: [
      { input: 's = "42"', output: '42' },
      { input: 's = "   -42"', output: '-42' },
      { input: 's = "4193 with words"', output: '4193' }
    ],
    boilerplate: `class Solution {\n    public int myAtoi(String s) {\n        \n    }\n}`
  },
  {
    id: '9',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    topics: ['Math'],
    description: `Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a <strong>palindrome</strong>, and <code>false</code> otherwise.`,
    examples: [
      { input: 'x = 121', output: 'true' },
      { input: 'x = -121', output: 'false' },
      { input: 'x = 10', output: 'false' }
    ],
    boilerplate: `class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}`
  },
  {
    id: '10',
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    topics: ['String', 'Dynamic Programming', 'Recursion'],
    description: `Given an input string <code>s</code> and a pattern <code>p</code>, implement regular expression matching with support for <code>'.'</code> and <code>'*'</code> where: <br/> <code>'.'</code> Matches any single character.             <br/> <code>'*'</code> Matches zero or more of the preceding element.`,
    examples: [
      { input: 's = "aa", p = "a"', output: 'false' },
      { input: 's = "aa", p = "a*"', output: 'true' },
      { input: 's = "ab", p = ".*"', output: 'true' }
    ],
    boilerplate: `class Solution {\n    public boolean isMatch(String s, String p) {\n        \n    }\n}`
  },
  {
    id: '11',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topics: ['Array', 'Two Pointers'],
    description: `You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>ith</code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.<br/><br/>Find two lines that together with the x-axis form a container, such that the container contains the most water.<br/><br/>Return the maximum amount of water a container can store.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' }
    ],
    boilerplate: `class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}`
  },
  {
    id: '12',
    title: 'Integer to Roman',
    difficulty: 'Medium',
    topics: ['Hash Table', 'Math', 'String'],
    description: `Seven different symbols represent Roman numerals with the following values: <br/> I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.<br/><br/>Given an integer, convert it to a Roman numeral.`,
    examples: [
      { input: 'num = 3749', output: '"MMMDCCXLIX"' },
      { input: 'num = 58', output: '"LVIII"' },
      { input: 'num = 1994', output: '"MCMXCIV"' }
    ],
    boilerplate: `class Solution {\n    public String intToRoman(int num) {\n        \n    }\n}`
  },
  {
    id: '13',
    title: 'Roman to Integer',
    difficulty: 'Easy',
    topics: ['Hash Table', 'Math', 'String'],
    description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given a roman numeral, convert it to an integer.`,
    examples: [
      { input: 's = "III"', output: '3' },
      { input: 's = "LVIII"', output: '58' },
      { input: 's = "MCMXCIV"', output: '1994' }
    ],
    boilerplate: `class Solution {\n    public int romanToInt(String s) {\n        \n    }\n}`
  },
  {
    id: '14',
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    topics: ['String'],
    description: `Write a function to find the longest common prefix string amongst an array of strings.<br/><br/>If there is no common prefix, return an empty string <code>""</code>.`,
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
      { input: 'strs = ["dog","racecar","car"]', output: '""' }
    ],
    boilerplate: `class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        \n    }\n}`
  },
  {
    id: '15',
    title: '3Sum',
    difficulty: 'Medium',
    topics: ['Array', 'Two Pointers', 'Sorting'],
    description: `Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.<br/><br/>Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' }
    ],
    boilerplate: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}`
  },
  {
    id: '16',
    title: '3Sum Closest',
    difficulty: 'Medium',
    topics: ['Array', 'Two Pointers', 'Sorting'],
    description: `Given an integer array <code>nums</code> of length <code>n</code> and an integer <code>target</code>, find three integers in <code>nums</code> such that the sum is closest to <code>target</code>.<br/><br/>Return the sum of the three integers.`,
    examples: [
      { input: 'nums = [-1,2,1,-4], target = 1', output: '2' },
      { input: 'nums = [0,0,0], target = 1', output: '0' }
    ],
    boilerplate: `class Solution {\n    public int threeSumClosest(int[] nums, int target) {\n        \n    }\n}`
  },
  {
    id: '17',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    topics: ['Hash Table', 'String', 'Backtracking'],
    description: `Given a string containing digits from <code>2-9</code> inclusive, return all possible letter combinations that the number could represent. Return the answer in <strong>any order</strong>.`,
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: 'digits = ""', output: '[]' },
      { input: 'digits = "2"', output: '["a","b","c"]' }
    ],
    boilerplate: `class Solution {\n    public List<String> letterCombinations(String digits) {\n        \n    }\n}`
  },
  {
    id: '18',
    title: '4Sum',
    difficulty: 'Medium',
    topics: ['Array', 'Two Pointers', 'Sorting'],
    description: `Given an array nums of n integers, return an array of all the unique quadruplets <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that...`,
    examples: [
      { input: 'nums = [1,0,-1,0,-2,2], target = 0', output: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]' }
    ],
    boilerplate: `class Solution {\n    public List<List<Integer>> fourSum(int[] nums, int target) {\n        \n    }\n}`
  },
  {
    id: '19',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    topics: ['Linked List', 'Two Pointers'],
    description: `Given the <code>head</code> of a linked list, remove the <code>n</code>th node from the end of the list and return its head.`,
    examples: [
      { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]' },
      { input: 'head = [1], n = 1', output: '[]' },
      { input: 'head = [1,2], n = 1', output: '[1]' }
    ],
    boilerplate: `/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        \n    }\n}`
  },
  {
    id: '20',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    topics: ['Linked List', 'Recursion'],
    description: `You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.<br/><br/>Merge the two lists into one <strong>sorted</strong> list. The list should be made by splicing together the nodes of the first two lists.<br/><br/>Return the head of the merged linked list.`,
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' }
    ],
    boilerplate: `/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}`
  },
  {
    id: '21',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    topics: ['String', 'Dynamic Programming', 'Backtracking'],
    description: `Given <code>n</code> pairs of parentheses, write a function to <em>generate all combinations of well-formed parentheses</em>.`,
    examples: [
      { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: 'n = 1', output: '["()"]' }
    ],
    boilerplate: `class Solution {\n    public List<String> generateParenthesis(int n) {\n        \n    }\n}`
  },
  {
    id: '22',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    topics: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'],
    description: `You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.<br/><br/>Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' },
      { input: 'lists = [[]]', output: '[]' }
    ],
    boilerplate: `/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n * }...\nclass Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        \n    }\n}`
  },
  {
    id: '23',
    title: 'Swap Nodes in Pairs',
    difficulty: 'Medium',
    topics: ['Linked List', 'Recursion'],
    description: `Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)`,
    examples: [
      { input: 'head = [1,2,3,4]', output: '[2,1,4,3]' },
      { input: 'head = []', output: '[]' },
      { input: 'head = [1]', output: '[1]' }
    ],
    boilerplate: `class Solution {\n    public ListNode swapPairs(ListNode head) {\n        \n    }\n}`
  },
  {
    id: '24',
    title: 'Reverse Nodes in k-Group',
    difficulty: 'Hard',
    topics: ['Linked List', 'Recursion'],
    description: `Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time, and return the modified list.`,
    examples: [
      { input: 'head = [1,2,3,4,5], k = 2', output: '[2,1,4,3,5]' },
      { input: 'head = [1,2,3,4,5], k = 3', output: '[3,2,1,4,5]' }
    ],
    boilerplate: `class Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        \n    }\n}`
  },
  {
    id: '25',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    topics: ['Array', 'Two Pointers'],
    description: `Given an integer array <code>nums</code> sorted in <strong>non-decreasing order</strong>, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in <code>nums</code>.`,
    examples: [
      { input: 'nums = [1,1,2]', output: '2, nums = [1,2,_]' },
      { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5, nums = [0,1,2,3,4,_,_,_,_,_]' }
    ],
    boilerplate: `class Solution {\n    public int removeDuplicates(int[] nums) {\n        \n    }\n}`
  },
  {
    id: '26',
    title: 'Remove Element',
    difficulty: 'Easy',
    topics: ['Array', 'Two Pointers'],
    description: `Given an integer array <code>nums</code> and an integer <code>val</code>, remove all occurrences of <code>val</code> in <code>nums</code> in-place. The order of the elements may be changed. Then return the number of elements in <code>nums</code> which are not equal to <code>val</code>.`,
    examples: [
      { input: 'nums = [3,2,2,3], val = 3', output: '2, nums = [2,2,_,_]' },
      { input: 'nums = [0,1,2,2,3,0,4,2], val = 2', output: '5, nums = [0,1,4,0,3,_,_,_]' }
    ],
    boilerplate: `class Solution {\n    public int removeElement(int[] nums, int val) {\n        \n    }\n}`
  },
  {
    id: '27',
    title: 'Find the Index of the First Occurrence in a String',
    difficulty: 'Easy',
    topics: ['Two Pointers', 'String', 'String Matching'],
    description: `Given two strings <code>needle</code> and <code>haystack</code>, return the index of the first occurrence of <code>needle</code> in <code>haystack</code>, or <code>-1</code> if <code>needle</code> is not part of <code>haystack</code>.`,
    examples: [
      { input: 'haystack = "sadbutsad", needle = "sad"', output: '0' },
      { input: 'haystack = "leetcode", needle = "leeto"', output: '-1' }
    ],
    boilerplate: `class Solution {\n    public int strStr(String haystack, String needle) {\n        \n    }\n}`
  },
  {
    id: '28',
    title: 'Divide Two Integers',
    difficulty: 'Medium',
    topics: ['Math', 'Bit Manipulation'],
    description: `Given two integers <code>dividend</code> and <code>divisor</code>, divide two integers without using multiplication, division, and mod operator.`,
    examples: [
      { input: 'dividend = 10, divisor = 3', output: '3' },
      { input: 'dividend = 7, divisor = -3', output: '-2' }
    ],
    boilerplate: `class Solution {\n    public int divide(int dividend, int divisor) {\n        \n    }\n}`
  },
  {
    id: '29',
    title: 'Substring with Concatenation of All Words',
    difficulty: 'Hard',
    topics: ['Hash Table', 'String', 'Sliding Window'],
    description: `You are given a string <code>s</code> and an array of strings <code>words</code>. All the strings of <code>words</code> are of the same length.<br/><br/>A concatenated substring in <code>s</code> is a substring that contains all the strings of any permutation of <code>words</code> concatenated.<br/><br/>Return the starting indices of all the concatenated substrings in <code>s</code>. You can return the answer in any order.`,
    examples: [
      { input: 's = "barfoothefoobarman", words = ["foo","bar"]', output: '[0,9]' },
      { input: 's = "wordgoodgoodgoodbestword", words = ["word","good","best","word"]', output: '[]' },
      { input: 's = "barfoofoobarthefoobarman", words = ["bar","foo","the"]', output: '[6,9,12]' }
    ],
    boilerplate: `class Solution {\n    public List<Integer> findSubstring(String s, String[] words) {\n        \n    }\n}`
  },
  {
    id: '30',
    title: 'Next Permutation',
    difficulty: 'Medium',
    topics: ['Array', 'Two Pointers'],
    description: `A permutation of an array of integers is an arrangement of its members into a sequence or linear order...`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[1,3,2]' },
      { input: 'nums = [3,2,1]', output: '[1,2,3]' },
      { input: 'nums = [1,1,5]', output: '[1,5,1]' }
    ],
    boilerplate: `class Solution {\n    public void nextPermutation(int[] nums) {\n        \n    }\n}`
  },
  {
    id: '31',
    title: 'Longest Valid Parentheses',
    difficulty: 'Hard',
    topics: ['String', 'Dynamic Programming', 'Stack'],
    description: `Given a string containing just the characters <code>'('</code> and <code>')'</code>, return the length of the longest valid (well-formed) parentheses substring.`,
    examples: [
      { input: 's = "(()"', output: '2' },
      { input: 's = ")()())"', output: '4' },
      { input: 's = ""', output: '0' }
    ],
    boilerplate: `class Solution {\n    public int longestValidParentheses(String s) {\n        \n    }\n}`
  },
  {
    id: '32',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    topics: ['Array', 'Binary Search'],
    description: `There is an integer array <code>nums</code> sorted in ascending order (with distinct values).<br/><br/>Prior to being passed to your function, <code>nums</code> is possibly rotated at an unknown pivot index <code>k</code> <code>(1 <= k < nums.length)</code> such that the resulting array is <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code> (0-indexed). For example, <code>[0,1,2,4,5,6,7]</code> might be rotated at pivot index <code>3</code> and become <code>[4,5,6,7,0,1,2]</code>.<br/><br/>Given the array <code>nums</code> after the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not in <code>nums</code>.<br/><br/>You must write an algorithm with <code>O(log n)</code> runtime complexity.`,
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
      { input: 'nums = [1], target = 0', output: '-1' }
    ],
    boilerplate: `class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}`
  },
  {
    id: '33',
    title: 'Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    topics: ['Array', 'Binary Search'],
    description: `Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value.<br/><br/>If <code>target</code> is not found in the array, return <code>[-1, -1]</code>.<br/><br/>You must write an algorithm with <code>O(log n)</code> runtime complexity.`,
    examples: [
      { input: 'nums = [5,7,7,8,8,10], target = 8', output: '[3,4]' },
      { input: 'nums = [5,7,7,8,8,10], target = 6', output: '[-1,-1]' },
      { input: 'nums = [], target = 0', output: '[-1,-1]' }
    ],
    boilerplate: `class Solution {\n    public int[] searchRange(int[] nums, int target) {\n        \n    }\n}`
  },
  {
    id: '34',
    title: 'Search Insert Position',
    difficulty: 'Easy',
    topics: ['Array', 'Binary Search'],
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.<br/><br/>You must write an algorithm with <code>O(log n)</code> runtime complexity.`,
    examples: [
      { input: 'nums = [1,3,5,6], target = 5', output: '2' },
      { input: 'nums = [1,3,5,6], target = 2', output: '1' },
      { input: 'nums = [1,3,5,6], target = 7', output: '4' }
    ],
    boilerplate: `class Solution {\n    public int searchInsert(int[] nums, int target) {\n        \n    }\n}`
  },
  {
    id: '35',
    title: 'Valid Sudoku',
    difficulty: 'Medium',
    topics: ['Array', 'Hash Table', 'Matrix'],
    description: `Determine if a <code>9 x 9</code> Sudoku board is valid. Only the filled cells need to be validated according to the following rules:<br/><br/>1. Each row must contain the digits <code>1-9</code> without repetition.<br/>2. Each column must contain the digits <code>1-9</code> without repetition.<br/>3. Each of the nine <code>3 x 3</code> sub-boxes of the grid must contain the digits <code>1-9</code> without repetition.`,
    examples: [
      { input: 'board = [["5","3",".",".","7",".",".",".","."],...]', output: 'true' },
      { input: 'board = [["8","3",".",".","7",".",".",".","."],...]', output: 'false' }
    ],
    boilerplate: `class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        \n    }\n}`
  },
  {
    id: '36',
    title: 'Sudoku Solver',
    difficulty: 'Hard',
    topics: ['Array', 'Hash Table', 'Backtracking', 'Matrix'],
    description: `Write a program to solve a Sudoku puzzle by filling the empty cells.`,
    examples: [
      { input: 'board = [["5","3",".",".","7",".",".",".","."],...]', output: '[["5","3","4","6","7","8","9","1","2"],...]' }
    ],
    boilerplate: `class Solution {\n    public void solveSudoku(char[][] board) {\n        \n    }\n}`
  },
  {
    id: '37',
    title: 'Count and Say',
    difficulty: 'Medium',
    topics: ['String'],
    description: `The <strong>count-and-say</strong> sequence is a sequence of digit strings defined by the recursive formula...`,
    examples: [
      { input: 'n = 1', output: '"1"' },
      { input: 'n = 4', output: '"1211"' }
    ],
    boilerplate: `class Solution {\n    public String countAndSay(int n) {\n        \n    }\n}`
  },
  {
    id: '38',
    title: 'Combination Sum',
    difficulty: 'Medium',
    topics: ['Array', 'Backtracking'],
    description: `Given an array of <strong>distinct</strong> integers <code>candidates</code> and a target integer <code>target</code>, return a list of all <strong>unique combinations</strong> of <code>candidates</code> where the chosen numbers sum to <code>target</code>. You may return the combinations in <strong>any order</strong>.`,
    examples: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
      { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' },
      { input: 'candidates = [2], target = 1', output: '[]' }
    ],
    boilerplate: `class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        \n    }\n}`
  },
  {
    id: '39',
    title: 'Combination Sum II',
    difficulty: 'Medium',
    topics: ['Array', 'Backtracking'],
    description: `Given a collection of candidate numbers (<code>candidates</code>) and a target number (<code>target</code>), find all unique combinations in <code>candidates</code> where the candidate numbers sum to <code>target</code>.<br/><br/>Each number in <code>candidates</code> may only be used <strong>once</strong> in the combination.<br/><br/><strong>Note:</strong> The solution set must not contain duplicate combinations.`,
    examples: [
      { input: 'candidates = [10,1,2,7,6,1,5], target = 8', output: '[\n  [1,1,6],\n  [1,2,5],\n  [1,7],\n  [2,6]\n]' },
      { input: 'candidates = [2,5,2,1,2], target = 5', output: '[\n  [1,2,2],\n  [5]\n]' }
    ],
    boilerplate: `class Solution {\n    public List<List<Integer>> combinationSum2(int[] candidates, int target) {\n        \n    }\n}`
  },
  {
    id: '40',
    title: 'First Missing Positive',
    difficulty: 'Hard',
    topics: ['Array', 'Hash Table'],
    description: `Given an unsorted integer array <code>nums</code>. Return the <em>smallest positive integer</em> that is not present in <code>nums</code>.<br/><br/>You must implement an algorithm that runs in <code>O(n)</code> time and uses <code>O(1)</code> auxiliary space.`,
    examples: [
      { input: 'nums = [1,2,0]', output: '3' },
      { input: 'nums = [3,4,-1,1]', output: '2' },
      { input: 'nums = [7,8,9,11,12]', output: '1' }
    ],
    boilerplate: `class Solution {\n    public int firstMissingPositive(int[] nums) {\n        \n    }\n}`
  },
  {
    id: '41',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topics: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
    description: `Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    boilerplate: `class Solution {\n    public int trap(int[] height) {\n        \n    }\n}`
  },
  {
    id: '42',
    title: 'Multiply Strings',
    difficulty: 'Medium',
    topics: ['Math', 'String', 'Simulation'],
    description: `Given two non-negative integers <code>num1</code> and <code>num2</code> represented as strings, return the product of <code>num1</code> and <code>num2</code>, also represented as a string.<br/><br/><strong>Note:</strong> You must not use any built-in BigInteger library or convert the inputs to integer directly.`,
    examples: [
      { input: 'num1 = "2", num2 = "3"', output: '"6"' },
      { input: 'num1 = "123", num2 = "456"', output: '"56088"' }
    ],
    boilerplate: `class Solution {\n    public String multiply(String num1, String num2) {\n        \n    }\n}`
  },
  {
    id: '43',
    title: 'Wildcard Matching',
    difficulty: 'Hard',
    topics: ['String', 'Dynamic Programming', 'Greedy', 'Recursion'],
    description: `Given an input string (<code>s</code>) and a pattern (<code>p</code>), implement wildcard pattern matching with support for <code>'?'</code> and <code>'*'</code> where:<br/><code>'?'</code> Matches any single character.<br/><code>'*'</code> Matches any sequence of characters (including the empty sequence).<br/><br/>The matching should cover the <strong>entire</strong> input string (not partial).`,
    examples: [
      { input: 's = "aa", p = "a"', output: 'false' },
      { input: 's = "aa", p = "*"', output: 'true' },
      { input: 's = "cb", p = "?a"', output: 'false' }
    ],
    boilerplate: `class Solution {\n    public boolean isMatch(String s, String p) {\n        \n    }\n}`
  },
  {
    id: '44',
    title: 'Jump Game II',
    difficulty: 'Medium',
    topics: ['Array', 'Dynamic Programming', 'Greedy'],
    description: `You are given a <strong>0-indexed</strong> array of integers <code>nums</code> of length <code>n</code>. You are initially positioned at <code>nums[0]</code>.<br/><br/>Each element <code>nums[i]</code> represents the maximum length of a forward jump from index <code>i</code>. In other words, if you are at <code>nums[i]</code>, you can jump to any <code>nums[i + j]</code> where:<br/><code>0 <= j <= nums[i]</code> and<br/><code>i + j < n</code><br/><br/>Return the minimum number of jumps to reach <code>nums[n - 1]</code>. The test cases are generated such that you can reach <code>nums[n - 1]</code>.`,
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: '2' },
      { input: 'nums = [2,3,0,1,4]', output: '2' }
    ],
    boilerplate: `class Solution {\n    public int jump(int[] nums) {\n        \n    }\n}`
  },
  {
    id: '45',
    title: 'Permutations',
    difficulty: 'Medium',
    topics: ['Array', 'Backtracking'],
    description: `Given an array <code>nums</code> of distinct integers, return all the possible permutations. You can return the answer in <strong>any order</strong>.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' },
      { input: 'nums = [1]', output: '[[1]]' }
    ],
    boilerplate: `class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        \n    }\n}`
  },
  {
    id: '46',
    title: 'Permutations II',
    difficulty: 'Medium',
    topics: ['Array', 'Backtracking'],
    description: `Given a collection of numbers, <code>nums</code>, that might contain duplicates, return all possible unique permutations <strong>in any order</strong>.`,
    examples: [
      { input: 'nums = [1,1,2]', output: '\n[[1,1,2],\n [1,2,1],\n [2,1,1]]' },
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' }
    ],
    boilerplate: `class Solution {\n    public List<List<Integer>> permuteUnique(int[] nums) {\n        \n    }\n}`
  },
  {
    id: '47',
    title: 'Rotate Image',
    difficulty: 'Medium',
    topics: ['Array', 'Math', 'Matrix'],
    description: `You are given an <code>n x n</code> 2D <code>matrix</code> representing an image, rotate the image by <strong>90</strong> degrees (clockwise).<br/><br/>You have to rotate the image <strong>in-place</strong>, which means you have to modify the input 2D matrix directly. <strong>DO NOT</strong> allocate another 2D matrix and do the rotation.`,
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
      { input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' }
    ],
    boilerplate: `class Solution {\n    public void rotate(int[][] matrix) {\n        \n    }\n}`
  },
  {
    id: '48',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    topics: ['Array', 'Hash Table', 'String', 'Sorting'],
    description: `Given an array of strings <code>strs</code>, group <strong>the anagrams</strong> together. You can return the answer in <strong>any order</strong>.<br/><br/>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' }
    ],
    boilerplate: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        \n    }\n}`
  },
  {
    id: '49',
    title: 'Pow(x, n)',
    difficulty: 'Medium',
    topics: ['Math', 'Recursion'],
    description: `Implement <code>pow(x, n)</code>, which calculates <code>x</code> raised to the power <code>n</code> (i.e., <code>x^n</code>).`,
    examples: [
      { input: 'x = 2.00000, n = 10', output: '1024.00000' },
      { input: 'x = 2.10000, n = 3', output: '9.26100' },
      { input: 'x = 2.00000, n = -2', output: '0.25000' }
    ],
    boilerplate: `class Solution {\n    public double myPow(double x, int n) {\n        \n    }\n}`
  },
  {
    id: '50',
    title: 'N-Queens',
    difficulty: 'Hard',
    topics: ['Array', 'Backtracking'],
    description: `The <strong>n-queens</strong> puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.<br/><br/>Given an integer <code>n</code>, return <em>all distinct solutions to the <strong>n-queens puzzle</strong></em>. You may return the answer in <strong>any order</strong>.`,
    examples: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { input: 'n = 1', output: '[["Q"]]' }
    ],
    boilerplate: `class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        \n    }\n}`
  },
  {
    id: '51',
    title: 'N-Queens II',
    difficulty: 'Hard',
    topics: ['Backtracking'],
    description: `The <strong>n-queens</strong> puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.<br/><br/>Given an integer <code>n</code>, return <em>the number of distinct solutions to the <strong>n-queens puzzle</strong></em>.`,
    examples: [
      { input: 'n = 4', output: '2' },
      { input: 'n = 1', output: '1' }
    ],
    boilerplate: `class Solution {\n    public int totalNQueens(int n) {\n        \n    }\n}`
  },
  {
    id: '52',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    topics: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    description: `Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    boilerplate: `class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}`
  },
  {
    id: '53',
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    topics: ['Array', 'Matrix', 'Simulation'],
    description: `Given an <code>m x n</code> <code>matrix</code>, return <em>all elements of the <code>matrix</code> in spiral order</em>.`,
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' }
    ],
    boilerplate: `class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        \n    }\n}`
  },
  {
    id: '54',
    title: 'Jump Game',
    difficulty: 'Medium',
    topics: ['Array', 'Dynamic Programming', 'Greedy'],
    description: `You are given an integer array <code>nums</code>. You are initially positioned at the array's <strong>first index</strong>, and each element in the array represents your maximum jump length at that position.<br/><br/>Return <code>true</code> if you can reach the last index, or <code>false</code> otherwise.`,
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: 'true' },
      { input: 'nums = [3,2,1,0,4]', output: 'false' }
    ],
    boilerplate: `class Solution {\n    public boolean canJump(int[] nums) {\n        \n    }\n}`
  },
  {
    id: '55',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    topics: ['Array', 'Sorting'],
    description: `Given an array of <code>intervals</code> where <code>intervals[i] = [starti, endi]</code>, merge all overlapping intervals, and return <em>an array of the non-overlapping intervals that cover all the intervals in the input</em>.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }
    ],
    boilerplate: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}`
  },
  {
    id: '56',
    title: 'Insert Interval',
    difficulty: 'Medium',
    topics: ['Array'],
    description: `You are given an array of non-overlapping intervals <code>intervals</code> where <code>intervals[i] = [starti, endi]</code> represent the start and the end of the <code>ith</code> interval and <code>intervals</code> is sorted in ascending order by <code>starti</code>.<br/><br/>You are also given an interval <code>newInterval = [start, end]</code> that represents the start and end of another interval.<br/><br/>Insert <code>newInterval</code> into <code>intervals</code> such that <code>intervals</code> is still sorted in ascending order by <code>starti</code> and <code>intervals</code> still does not have any overlapping intervals (merge overlapping intervals if necessary).<br/><br/>Return <code>intervals</code> after the insertion.`,
    examples: [
      { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]' },
      { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]' }
    ],
    boilerplate: `class Solution {\n    public int[][] insert(int[][] intervals, int[] newInterval) {\n        \n    }\n}`
  },
  {
    id: '57',
    title: 'Length of Last Word',
    difficulty: 'Easy',
    topics: ['String'],
    description: `Given a string <code>s</code> consisting of words and spaces, return <em>the length of the <strong>last</strong> word in the string.</em>`,
    examples: [
      { input: 's = "Hello World"', output: '5' },
      { input: 's = "   fly me   to   the moon  "', output: '4' }
    ],
    boilerplate: `class Solution {\n    public int lengthOfLastWord(String s) {\n        \n    }\n}`
  },
  {
    id: '58',
    title: 'Spiral Matrix II',
    difficulty: 'Medium',
    topics: ['Array', 'Matrix', 'Simulation'],
    description: `Given a positive integer <code>n</code>, generate an <code>n x n</code> <code>matrix</code> filled with elements from <code>1</code> to <code>n2</code> in spiral order.`,
    examples: [
      { input: 'n = 3', output: '[[1,2,3],[8,9,4],[7,6,5]]' }
    ],
    boilerplate: `class Solution {\n    public int[][] generateMatrix(int n) {\n        \n    }\n}`
  },
  {
    id: '59',
    title: 'Permutation Sequence',
    difficulty: 'Hard',
    topics: ['Math', 'Recursion'],
    description: `The set <code>[1, 2, 3, ..., n]</code> contains a total of <code>n!</code> unique permutations.`,
    examples: [
      { input: 'n = 3, k = 3', output: '"213"' }
    ],
    boilerplate: `class Solution {\n    public String getPermutation(int n, int k) {\n        \n    }\n}`
  },
  {
    id: '60',
    title: 'Rotate List',
    difficulty: 'Medium',
    topics: ['Linked List', 'Two Pointers'],
    description: `Given the <code>head</code> of a linked list, rotate the list to the right by <code>k</code> places.`,
    examples: [
      { input: 'head = [1,2,3,4,5], k = 2', output: '[4,5,1,2,3]' }
    ],
    boilerplate: `class Solution {\n    public ListNode rotateRight(ListNode head, int k) {\n        \n    }\n}`
  }
];
