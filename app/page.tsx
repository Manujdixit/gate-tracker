import React, { useState, useEffect, useCallback, useMemo } from "react";

// --- Initial Data & Configuration ---
const courseDataRaw = `
C Programming
Introduction To C Programming - Part I • 1h 59m
Introduction to C Programming - Part II • 1h 44m
Data Types • 1h 49m
Operators - Part I • 1h 57m
Problem Solving Session - Part I • 1h 37m
Operators - Part II • 1h 41m
Operators - Part III • 1h 29m
Control flow statements - Part I • 1h 54m
Control flow statements - Part II • 1h 40m
Control flow statements - Part III • 1h 32m
Control flow statements - Part IV • 1h 36m
Control flow statements - Part V • 1h 12m
Functions and Storage Classes - Part I • 1h 40m
Functions and Storage Classes - Part II • 1h 35m
Recursion - Part I • 1h 18m
Recursion - Part II • 1h 19m
Recursion - Part III • 1h 47m
Problem Solving • 1h 12m
Arrays and Pointers - Part I • 33m
Arrays & Pointers Part - II • 1h 2m
Arrays & Pointers Part - III • 1h 14m
Arrays & Pointers Part - IV • 1h 12m
Arrays & Pointers Part - V • 1h 10m
Arrays & Pointers Part - VI • 1h 3m
Arrays & Pointers Part - VII • 1h 5m
Arrays & Pointers - Part VIII • 1h 3m
Arrays & Pointers - Part XI • 1h
Arrays & Pointers - Part X • 1h 3m
Strings - Part I • 1h 1m
Strings - Part II • 1h 3m
Strings - Part III • 40m
Structure and Union • 32m
Miscellaneous Topics • 39m
Miscellaneous Topics - Part II • 1h
Miscellaneous Topics - Part III • 53m
PYQs - Part I • 1h 1m
PYQs - Part II • 1h 26m
PYQs - Part III • 1h 28m
PYQs - Part IV • 45m
Data Structures
Introduction • 1h 1m
Arrays - Part I • 1h 15m
Arrays - Part II • 1h 11m
Arrays - Part III • 1h 5m
Arrays - Part IV • 41m
Problem Solving • 1h
Linked List - Part I • 1h 6m
Linked List - Part II • 1h 3m
Linked List - Part III • 1h
Linked List - Part IV • 59m
Linked List - Part V • 1h 3m
Linked List - Part VI • 1h 1m
Linked List - Part VII • 1h
Stack and Queue - Part I • 58m
Stack and Queue - Part II • 1h 2m
Stack and Queue - Part III • 1h 9m
Stack & Queue -Part IV • 1h 5m
Stack & Queue -Part V • 1h 6m
Stack & Queue - Part VI • 1h 30m
Stack & Queue - Part VII • 1h 29m
Trees - Part I • 1h 31m
Trees - Part II • 1h 13m
Trees - Part III • 1h 13m
Trees - Part IV • 1h
Trees - Part V • 1h 7m
Trees - Part VI • 54m
Trees - Part VII • 25m
Trees - Part VIII • 1h 10m
Trees - Part X • 56m
Graph Representation • 1h 2m
Hashing • 48m
Revision • 1h 2m
PYQs - Part I • 52m
Problem Solving - Part I • 1h 31m
Problem solving - Part II • 1h 30m
Problem solving - Part III • 1h 31m
Problem solving - Part IV • 1h 40m
Problem solving - Part V • 1h 1m
Theory of Computation
Basics Of Theory Of Computation - Part I • 2h 1m
Basics Of Theory Of Computation - Part II • 2h 4m
Regular Expressions - Part I • 2h 3m
Regular Expressions - Part II • 2h 3m
Regular Expressions - Part III • 2h 19m
Finite Automata - Part I • 2h 14m
Finite Automata - Part II • 2h 9m
Finite Automata Part - III • 2h 5m
Finite Automata - Part IV • 2h 19m
Finite Automata - Part V • 2h 14m
Finite Automata - Part VI • 2h 14m
Finite Automata - Part VII • 2h 22m
Regular Grammar • 2h 13m
Conversion Techniques • 2h 24m
Regular & Non-Regular Languages - Part I • 2h 15m
Regular & Non-Regular Languages - Part II • 2h 34m
Closure Properties - Part I • 2h 28m
Closure Properties - Part II • 2h 42m
Closure Properties - Part III • 2h 55m
Pumping Lemma & Myhill Nerode Theorem • 2h 19m
Moore & Mealy Machines • 2h 42m
Context Free Grammar - Part I • 2h 58m
Context Free Grammar - Part II • 2h 15m
Context Free Grammar - Part III • 2h 16m
Push Down Automata - Part I • 2h 23m
Push Down Automata - Part II • 3h
Push Down Automata - Part III • 2h 18m
DCFLs and CFLs • 1h 55m
Closure Properties - Part I • 1h 48m
Closure Properties - Part II • 1h 47m
Turing Machine - Part I • 2h 27m
Turing Machine - Part II • 2h 9m
Turing Machine - Part III • 2h 19m
D, SDUD, Not RE, SD, and UD • 1h 31m
Decision Properties Table - Part I • 2h 3m
Decision Properties Table - Part II • 1h 25m
Decidable & Undecidable Languages - Part I • 2h 12m
Decidable & Undecidable Languages - Part II • 2h
Complete Revision On TOC - Part I • 2h 40m
Complete Revision On TOC - Part II • 2h 7m
Computer Networks
Introduction to IP Addressing • 51m
Classfull Addressing - Part I • 1h 52m
Classfull Addressing - Part II • 1h 5m
Problems in Computer network • 1h 9m
Types of Communication • 53m
Introduction to Subnetting • 2h 11m
Concept of Subnetting • 2h 4m
Advantages & disadvantage of Subnetting • 1h 29m
Subnetting - Part I • 1h 40m
Subnetting - Part II • 2h
Subnetting - Part III • 1h 59m
Subnetting Part-IV • 1h 8m
Subnetting -Part V • 1h 32m
Subnetting- Part VI • 2h 4m
Problem Solving on Subnetting -part I • 1h 56m
Problem Solving on Subnetting -part II • 1h 55m
Problem Solving on Subnetting -part III • 1h 39m
Classless Addressing -part I • 59m
Classless Addressing -part II • 2h 9m
Supernetting in Classless Addressing-Part I • 1h 46m
Supernetting in Classless Addressing-Part II • 1h 33m
Supernetting in Classfull Addressing • 1h 19m
Erroe Detection & Error Correction • 2h
Supernetting - Part I • 26m
Supernetting - Part II • 1h 33m
Hamming Distance-Part I • 2h 4m
Hamming Distance-Part II • 1h 7m
Simple Parity & 2D Parity • 1h 34m
Delay in Computer Network • 1h 27m
Stop and wait protocol-Part I • 1h 32m
Stop and wait protocol-Part II • 32m
Stop and wait protocol-Part III • 1h 53m
CRC • 1h 30m
Checksum & Hamming code • 1h 8m
Extra Class - Part I • 2h 1m
Extra Class - Part II • 48m
Stop and wait protocol-Part IV • 1h 41m
GO Back -N ARQ -Part I • 2h 3m
GO Back -N ARQ -Part II • 1h 51m
GO Back -N ARQ -Part III • 46m
Selective repeat ARQ- Part I • 2h
Selective repeat ARQ- Part II • 2h 10m
IPV4 Header-part I • 1h 45m
IPV4 Header-part III • 2h 3m
Fragmentation in IPv4-Part I • 1h 47m
IPV4 Header-part II • 1h 42m
Fragmentation in IPv4-Part II • 2h 2m
Fragmentation in IPv4-Part III • 1h 50m
TCP Header • 1h 50m
Wrap around Time • 1h 53m
Phases of TCP Connection-Part I • 46m
Phases of TCP Connection-Part II • 1h 26m
TCP State Transition Diagram • 1h 53m
PSH & URG Flag • 1h 53m
Flow control in TCP • 1h 56m
Silly window Syndrome • 1h 26m
TCP Timer Management-Part I • 1h 36m
TCP Congestion Control-Part I • 1h 50m
TCP Congestion Control-Part II • 56m
Error Control in TCP • 2h 2m
Traffic Shaping • 1h 35m
UDP Header • 46m
Multiple Access Protocols-Part I • 1h 57m
Multiple Access Protocols-Part II • 1h 23m
Multiple Access Protocols-Part III • 2h 1m
Routing Algorithms-Part I • 2h 8m
Routing Algorithms-Part II • 1h 50m
Routing Algorithms-Part III • 1h 42m
Switching-Part I • 1h 29m
Switching-Part II • 1h 29m
Switching-Part III • 1h 8m
IP Support protocol-Part I • 1h 49m
IP Support protocol-Part II • 1h 47m
Application Layer protocol-Part I • 1h 8m
Application Layer protocol-Part II • 1h 29m
OSI and TCP/IP Layers- Part I • 1h 52m
OSI and TCP/IP Layers- Part II • 2h 19m
Extra Class - Part III • 1h 24m
Extra Class - Part IV • 1h 57m
Extra Class - Part V • 1h 44m
Extra Class - Part VI • 1h 56m
Extra Class - Part VII • 1h 52m
Extra Class - Part VIII • 1h 55m
Extra Class - Part IX • 1h 59m
Extra Class - Part X • 58m
Extra Class - Part XI • 1h 21m
Extra Class - Part XIII • 1h 51m
Extra Class - Part XII • 1h 36m
Extra Class - Part XIV • 1h 33m
RDBMS
Introduction Of RDBMS • 1h 55m
Key Concepts & Finding Number of Candidate keys - Part I • 2h 11m
Key Concepts & Finding Number of Candidate keys - Part II • 2h 7m
Membership set & Equilty between FD Sets • 2h 7m
Minimal Cover • 2h 4m
Properties of Decomposition - Part I • 2h 6m
Properties of Decomposition - Part II • 2h 26m
Normal Form - Part I • 2h 15m
Normal Form - Part II • 2h 10m
Normal Form - Part III • 2h 25m
Normal Form- Part IV • 2h 9m
Normal Form- Part V • 2h 3m
Doubt Solving Session • 2h 8m
Finding Number of Super key • 2h 11m
Normal Form Gate PYQ's Discussion • 2h 9m
ER Model Concept • 2h 11m
ER Model Concept & Coversion of ER Model to RDBMS - Part I • 2h 8m
"ER Model Concept & Coversion of ER Model to RDBMS - Part II " • 2h 25m
Foreign Key Concept - Part I • 2h 14m
Foreign Key Concept - Part II • 2h 11m
Relational Algebra- Part I • 2h 10m
Relational Algebra - Part II • 2h 5m
Structured Query Language(SQL) - Part I • 2h 4m
Structured Query Language(SQL) - Part II • 2h 5m
Structured Query Language(SQL) - Part III • 2h
Structured Query Language(SQL) - Part IV • 2h 8m
Structured Query Language(SQL)-5 & TRC - Part V • 2h 4m
Doubt Solving Sesion on Query Language • 2h 5m
File Org & Indexing • 2h 13m
Multi level Indexing • 2h 1m
B Tree & B+ Tree - Part I • 2h 4m
B Tree & B+ Tree - Part II • 2h 8m
B Tree & B+ Tree - Part III • 1h 32m
Doubt Solving Sesion on Indexing • 2h 8m
B+ Tree & Null Value Concept • 2h 7m
Transaction Concept • 2h 9m
Serializable Schedule (Conflict & View) • 2h 3m
Serializable Schedule - Part II • 2h 5m
Serializable Schedule - Part III • 2h 5m
Problem due to concurrent execution • 2h 2m
Finding Number of Conflict Serializable Schedule • 2h 8m
Recoverable Schedule • 1h 34m
Lock Based Protocol - Part I • 2h 4m
Lock Based Protocol - Part II • 2h 2m
Lock Based Protocol - Part III • 2h 4m
Lock Based Protocol • 2h 12m
Data Warehousing Schema - Part II • 1h 34m
Data Warehousing Schema - Part III • 1h 41m
Data Transformation - Part I • 2h 3m
Data Transformation - Part II • 1h 39m
Data Transformation - Part III • 1h 16m
Data Transformation - Part IV • 1h 36m
Data Discretization - Part II • 1h 16m
Data Sampling & Compression- Part I • 1h 37m
Concept Hierarchiy & Computation • 1h 46m
Data Discretization - Part I • 2h 11m
Compiler Design
Introduction To Compiler Design • 2h 9m
Lexical Analysis - Part I • 2h 15m
Lexical Analysis - Part II • 2h 23m
Syntax Analysis - Basics Of CFG • 2h 33m
Syntax Analysis - Basics Of Parsers • 2h 9m
Syntax Analysis - Computation Of First And Follow Sets • 2h 22m
Syntax Analysis - Top Down Parser • 2h 9m
Syntax Analysis - LR(0) Parser • 2h 8m
Syntax Analysis - LR Parsers • 2h 16m
Syntax Analysis - LR Parsing Tables • 2h 11m
Syntax Analysis - LR Parsing Algorithm • 2h 11m
Syntax Analysis - Operator Precedence Parsing • 2h 5m
Practice On Syntax Analysis - GATE PYQs • 1h 26m
SDTs - Attributes And Definitions • 2h 26m
SDTs - Evaluation Techniques - Part I • 2h 5m
SDTs - Evaluation Techniques - Part II • 2h 22m
Intermediate Code Representations - Part I • 1h 19m
Intermediate Code Representations - Part II • 2h 4m
Control Flow Graphs • 1h 23m
Code Optimization - Part I • 1h 53m
Code Optimization - Part II • 1h 29m
Code Optimization - Part III • 1h 36m
Code Optimization - Part IV • 1h 12m
Run Time Environment • 1h 29m
Practice On Compiler Design • 1h 27m
Algorithms
Analysis of Algorithms - Part I • 2h 2m
Analysis of Algorithms - Part II • 1h 46m
Extra Class • 1h 31m
Analysis of Algorithms - Part III • 1h 38m
Analysis of Algorithms - Part IV • 1h 51m
Analysis of Algorithms - Part V • 2h 2m
Analysis of Algorithms - Part VI • 1h 55m
Divide and Conquer - Part I • 1h 50m
Divide and Conquer - Part II • 1h 14m
Divide and Conquer - Part III • 2h 2m
Divide and Conquer - Part IV • 2h
Greedy Method - Part I • 2h 1m
Greedy Method - Part II • 2h 1m
Greedy Method - Part III • 2h 1m
Heap and Set Operations • 2h
Greedy Method - Part IV • 2h 2m
Dynamic Programming - Part I • 1h 46m
Dynamic Programming - Part II • 1h 31m
Dynamic Programming - Part III • 1h 52m
Dynamic Programming - Part IV • 1h 57m
Dynamic Programming - Part V • 1h 48m
Graph Algorithms - Part I • 1h 41m
Graph Algorithms - Part II • 1h 30m
Sorting Methods • 1h 20m
Backtracking • 46m
Operating Systems
Introduction And Background - Part I • 2h 11m
Introduction And Background - Part II • 1h 35m
Introduction And Background - Part III • 2h 34m
Process Concepts - Part I • 2h 32m
Process Concepts - Part II • 2h 31m
CPU Scheduling - Part I • 2h 31m
System Calls • 2h 4m
CPU Scheduling - Part II • 2h 32m
CPU Scheduling - Part III • 2h 32m
CPU Scheduling - Part IV • 2h 30m
CPU Scheduling - Part V • 2h 33m
Threads • 2h 33m
Process Synchronization • 2h 3m
Process Synchronization • 1h 1m
Process Synchronization - Part I • 2h 33m
Process Synchronization - Part II • 2h 2m
Doubt Clearing Session • 45m
Process Synchronization - Part III • 2h 1m
Process Synchronization - Part IV • 2h 5m
Process Synchronization - Part V • 2h 3m
Process Synchronization - Part VI • 2h 3m
Deadlocks - Part I • 2h 2m
Deadlocks - Part II • 2h 3m
Deadlocks - Part III • 2h 1m
Basics of Memory Management • 2h 2m
Memory Management • 2h 1m
Memory Management Techniques - Part I • 2h 2m
Memory Management Techniques - Part II • 2h 5m
Memory Management Techniques - Part III • 2h 2m
Memory Management Techniques - Part IV • 2h 5m
Memory Management Techniques - Part V • 2h 11m
Virtual Memory - Part I • 2h 7m
Virtual Memory - Part II • 2h 3m
Virtual Memory - Part III • 2h 2m
Virtual Memory - Part IV • 2h 1m
File System • 2h 5m
Memory Management Techniques - Part VI • 2h 3m
File System Interface • 2h 4m
File System Implementation - Part I • 2h 3m
File System Implementation - Part II • 2h 2m
File System Implementation - Part III • 2h 4m
IO Scheduling (Disk Scheduling) • 2h 5m
Computer Organization
Basics & Prerequisites • 2h
Basics & Components of Computer • 2h 1m
Registers & Memory Access • 2h
Doubt Clearing Session • 1h 58m
Microoperations - Part I • 1h 58m
Microoperations - Part II • 1h 54m
Instructions - Part I • 1h 54m
Doubt Clearing Session • 1h 51m
Instructions - Part II • 1h 59m
Instructions - Part III • 1h 59m
Instructions - Part IV • 1h 59m
Doubt Clearing Session • 1h 57m
Addressing Modes - Part I • 1h 45m
Addressing Modes - Part II • 2h
CPU - Part I • 2h
Doubt Clearing Session • 1h 53m
CPU - Part II • 1h 24m
CPU - Part III • 2h
Floating Point Representation • 1h 58m
Doubt Clearing Session • 2h
IO Organization - Part I • 1h 59m
IO Organization - Part II • 1h 46m
IO Organization - Part III • 1h 50m
Doubt Clearing Session • 1h 53m
IO Organization - Part IV • 1h 57m
Memory Organization - Part I • 1h 40m
Memory Organization - Part II • 1h 56m
Doubt Clearing Session • 1h 48m
Memory Organization - Part III • 2h
Cache - Part I • 1h 47m
Cache - Part II • 2h
Cache - Part III • 2h
Cache - Part IV • 2h 1m
Cache - Part V • 34m
Doubt Clearing Session • 1h 58m
Cache - Part VI • 1h 59m
Cache - Part VII • 1h 4m
Cache - Part VIII • 2h
Doubt Clearing Session • 1h 59m
Cache - Part IX • 1h 53m
Cache - Part X • 1h 47m
Doubt Clearing Session • 2h
Disk - Part I • 1h 56m
Disk - Part III • 1h 59m
Doubt Clearing Session • 1h 46m
Pipeline - Part I • 1h 56m
Pipeline - Part II • 2h
Digital Logic
Syllabus Discussion & Weightage Analysis • 31m
Basics Of Number System • 1h 18m
Logic GATE - NOT GATE • 1h 3m
Logic GATE - AND/ OR GATE • 1h 17m
Logic GATE - NAND/ NOR GATE • 39m
How To Find Minimum Number Of NAND/NOR GATEs • 1h 3m
Logic GATE - XOR/XNOR GATE • 41m
Questions Based On Boolean Algebra • 56m
Questions Based On Logic GATEs • 1h 6m
Minimization - Basic of Boolean Functions • 1h 1m
Minimization - Basics Of KMAP • 1h 26m
Minimization - PI & EPI • 1h 27m
Questions Based On KMAP - Part II • 1h 23m
Questions Based On KAMP - Part I • 1h 15m
Questions Based On KMAP - Part III • 1h 2m
Combinational Circuit - Comparator • 16m
Combinational Circuit - Subtractor • 9m
Combinational Circuit - MUX - Part I • 1h 34m
Combinational Circuit - MUX - Part II • 1h 14m
Combinational Circuit - Adder • 56m
Combinational Circuit - DEMUX & ENCODER • 45m
Combinational Circuit - Decoder - Part I • 48m
Combinational Circuit - Decoder & Serial Adder • 1h 3m
Combinational Circuit - Parallel Adder • 1h 21m
Combinational Circuit - Look Ahead Carry Adder (LACA) • 1h 8m
Combinational Circuit - Multiplier • 32m
Questions Based On Combinational Circuit • 55m
Sequential Circuit - Latches • 57m
Sequential Circuit - SR & JK Flip Flop • 39m
Sequential Circuit - Race Around Problem • 1h 6m
Sequential Circuit - D & T Flip Flop • 1h 20m
Sequential Circuit - Counters • 39m
Sequential Circuit - Counter - Part I • 57m
Flip flop design • 45m
Registers • 44m
Sequential Circuit - Counter - Part II • 33m
Sequential Circuit - Counter - Part IV • 58m
Sequential Circuit - Counter - Part V • 57m
Sequential Circuit - Counter - Part VI • 37m
LOGIC GATE-XOR/XNOR GATE • 55m
Questions Based On Counter • 47m
Mealy and Moore FSM • 38m
Number System - Part IV • 1h 12m
Questions Based On Number System • 43m
Complete Revision Of Digital Logic • 49m
Number System • 54m
Discrete Mathematics
Basics Of Graphs • 17m
Degree Sequence in Graphs • 1h 29m
Types of Graphs - Part I • 1h 16m
Types of Graphs - Part II • 1h 45m
Connectivity - Part I • 1h 40m
Connectivity - Part II • 1h 23m
Connectivity - Part III • 1h 13m
Chromatic Number and Independent Set • 1h 16m
Matching and Covering • 1h 26m
Planarity - Part I • 51m
Planarity - Part II • 1h 11m
Planarity - Part III • 1h 32m
Directed Graphs and Properties • 1h 12m
Matrix Representation Of Graphs • 1h 42m
Propositional Logic • 1h 37m
Logical Equivalence • 26m
Inference Rule • 1h 55m
Predicate Logic • 1h 27m
Quantifier - Part I • 1h 20m
Quantifier - Part II • 1h 2m
Nested Quantifier • 1h 22m
Quantifier with Inference Rule - Part I • 1h 41m
Quantifier with Inference Rule - Part II • 1h 40m
Basics of Sets Theory • 1h 29m
Extra Class - Part I • 1h 23m
Basics of Functions • 1h 18m
Extra Class - Part II • 1h 2m
Extra Class - Part III • 1h 24m
Extra Class - Part IV • 1h 21m
Different Types of Functions • 1h 27m
Compositions Of Functions • 1h 17m
Extra Class - Part VI • 1h 19m
Basics Of Relations • 1h 31m
Extra Class - Part VII • 1h 20m
Types of Relation - Part I • 1h 45m
Extra Class - Part VIII • 1h 30m
Types of Relation - Part II • 1h 37m
Extra Class - Part IX • 57m
Extra Class - Part X • 1h 16m
Extra Class - Part XI • 1h 25m
Types of Relation - Part III • 1h 26m
Hasse Diagram • 1h 38m
Poset - Toset • 1h 28m
Latiices • 1h 30m
Group Theory - Part I • 1h 16m
Group Theory - Part II • 1h
Group Theory - Part III • 1h 20m
Basics of Combinatorics • 1h 27m
Permutations and Combination • 1h 30m
Combination with Repetitions • 1h 39m
Inclusion - Exclusion • 1h 49m
Problems on Inclusion - Exclusion • 1h 28m
Derangement • 1h 47m
Pigeonhole Principle - Part I • 1h 10m
Pigeonhole Principle - Part II • 1h 42m
Euler Totient Functions • 1h 46m
Recurrence Relation - Part I • 1h 56m
Recurrence Relation - Part II • 1h 36m
Recurrence Relation - Part III • 55m
Generating Functions - Part I • 1h 37m
Generating Functions - Part II • 1h 45m
Generating Functions - Part III • 1h 41m
Extended Binomial Coefficient • 1h 2m
Revision of Graph Theory • 1h 31m
Revision of Logic • 1h 29m
Revision of Set Theory • 1h 33m
Revision of Combinatorics • 57m
Engineering Mathematics
Counting Techniques Part-I • 1h 6m
Counting Techniques Part-III • 2h 5m
Counting Techniques Part-IV • 2h 8m
Counting Techniques Part-V • 1h 53m
Counting Techniques Part-VI • 1h 52m
Probability Theory Part - I • 2h 1m
Probability Theory Part - II • 1h 32m
Probability Theory Part - III • 24m
Probability Theory Part - IV • 1h 54m
Probability Theory Part - V • 1h 28m
Probability Theory Part - VI • 1h 14m
Probability Theory Part - VII • 1h 1m
Probability Theory Part - VIII • 1h 27m
Probability Theory Part - IX • 1h 20m
Random Variables Part - II • 1h 58m
Random variable Part - III • 1h 53m
Random variable Part - IV • 1h 53m
Probability Distributions Part - I • 58m
Random Variables Part - I • 1h 3m
Probability Distributions Part - II • 1h 18m
Probability Distributions Part - III • 1h 34m
Probability Distributions Part - IV • 1h 40m
Linear Algebra Part - I • 1h 27m
Linear Algebra Part - II • 1h 52m
Linear Algebra Part - III • 2h 3m
Linear Algebra Part - IV • 1h 1m
Linear Algebra Part - VI • 2h 11m
Linear Algebra Part - VII • 2h 4m
CALCULUS Part - I • 1h 29m
CALCULUS Part - II • 1h 52m
Calculus Part - III • 1h 54m
Calculus Part - IV • 2h 1m
Calculus Part - V • 1h 49m
Calculus Part - VI • 57m
Calculus Part - VII • 22m
Test of hypothesis Part - I • 1h 44m
Bivariate Random Variable Part - I • 1h 54m
Bivariate Random Variable Part - III • 1h 57m
Bivariate Random Variable Part - II • 1h 38m
Bivariate Random Variable Part - IV • 1h 25m
Test of hypothesis Part - III • 1h 33m
Test of hypothesis Part - II • 1h 51m
Two Dimensional Random Variable Part - I • 1h 40m
Two Dimensional Random Variable Part - II • 1h 36m
Two Dimensional Random Variable Part - III • 1h 31m
Two Dimensional Random Variable Part - IV • 1h 34m
Two Dimensional Random Variable Part - VI • 1h 29m
Two Dimensional Random Variable Part - V • 1h 44m
Sampling Distributions Part - I • 1h 31m
Sampling Distributions Part - II • 1h 26m
Z Test • 1h 24m
Chi Square Test • 1h
`;

const initialSubjectLinks = {
  "Engineering Mathematics":
    "https://unacademy.com/course/engineering-mathematics-for-data-science/HJTCB228",
  RDBMS:
    "https://unacademy.com/course/comprehensive-course-on-dbms-for-cs-&-da/VQZLADB0",
  "Computer Networks":
    "https://unacademy.com/course/comprehensive-course-in-computer-networks-386/M7HJC525",
  "Computer Organization":
    "https://unacademy.com/course/course-on-computer-organization-&-architecture-gate---23-&-24/20MLC86V",
  "Digital Logic":
    "https://unacademy.com/course/comprehensive-course-on-digital-logic-202/1Y7MHDY8",
  "Operating Systems":
    "https://unacademy.com/course/comprehensive-course-on-operating-system/UY44YXAO",
  Algorithms:
    "https://unacademy.com/course/complete-course-on-algorithms-for-csit/ZPSB16Y9",
  "Compiler Design":
    "https://unacademy.com/course/complete-course-on-compiler-design/21ZNGIKB",
  "Theory of Computation":
    "https://unacademy.com/course/complete-course-on-theory-of-computation-for-gate-cs-&-it/HQ10718Q",
  "Data Structures":
    "https://unacademy.com/course/course-on-data-structure/4IJKQO8D",
  "C Programming":
    "https://unacademy.com/course/comprehensive-course-on-c--programming/WY4D3M9Q",
  "Discrete Mathematics":
    "https://unacademy.com/course/complete-course-on-discrete-mathematics/CO76I25O",
};

const subjectImages = {
  "Engineering Mathematics":
    "https://placehold.co/600x400/7C3AED/FFFFFF?text=Calculus",
  RDBMS: "https://placehold.co/600x400/DB2777/FFFFFF?text=Database",
  "Computer Networks":
    "https://placehold.co/600x400/059669/FFFFFF?text=Networks",
  "Computer Organization":
    "https://placehold.co/600x400/D97706/FFFFFF?text=Architecture",
  "Digital Logic":
    "https://placehold.co/600x400/4F46E5/FFFFFF?text=Logic+Gates",
  "Operating Systems": "https://placehold.co/600x400/0284C7/FFFFFF?text=OS",
  Algorithms: "https://placehold.co/600x400/BE185D/FFFFFF?text=Algorithms",
  "Compiler Design": "https://placehold.co/600x400/6D28D9/FFFFFF?text=Compiler",
  "Theory of Computation":
    "https://placehold.co/600x400/047857/FFFFFF?text=TOC",
  "Data Structures":
    "https://placehold.co/600x400/4338CA/FFFFFF?text=Data+Structures",
  "C Programming": "https://placehold.co/600x400/0369A1/FFFFFF?text=C+Code",
  "Discrete Mathematics":
    "https://placehold.co/600x400/C026D3/FFFFFF?text=Discrete+Math",
};

const pyqLink =
  "https://practicepaper.in/gate-cse/topic-wise-practice-of-gate-cse-previous-year-papers";

// --- Helper Functions ---
const getTodayString = () => new Date().toISOString().split("T")[0];

const parseDurationToMinutes = (durationStr = "0m") => {
  let totalMinutes = 0;
  const hoursMatch = durationStr.match(/(\d+)h/);
  const minutesMatch = durationStr.match(/(\d+)m/);
  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
  if (minutesMatch) totalMinutes += parseInt(minutesMatch[1], 10);
  return totalMinutes;
};

const formatMinutesToHM = (minutes) => {
  if (isNaN(minutes) || minutes < 0) return "0h 0m";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
};

const parseCourseData = (rawData) => {
  const lines = rawData.trim().split("\n");
  const subjects = [];
  let currentSubject = null;
  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;
    if (line.includes("•")) {
      if (currentSubject) {
        const [name, duration] = line.split("•").map((s) => s.trim());
        currentSubject.lessons.push({
          id: crypto.randomUUID(),
          name,
          duration,
          durationInMinutes: parseDurationToMinutes(duration),
        });
      }
    } else {
      if (currentSubject) subjects.push(currentSubject);
      currentSubject = {
        name: line,
        lessons: [],
        link: initialSubjectLinks[line] || "",
      };
    }
  });
  if (currentSubject) subjects.push(currentSubject);
  return subjects;
};

// --- Child Components ---

const MotivationalQuote = () => {
  const [quote, setQuote] = useState("");
  const quotes = [
    "The secret of getting ahead is getting started.",
    "Believe you can and you're halfway there.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The expert in anything was once a beginner.",
    "Strive for progress, not perfection.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't watch the clock; do what it does. Keep going.",
    "The only way to do great work is to love what you do.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
  ];

  useEffect(() => {
    const today = getTodayString();
    const savedQuoteData = JSON.parse(localStorage.getItem("dailyQuote"));
    if (savedQuoteData && savedQuoteData.date === today) {
      setQuote(savedQuoteData.quote);
    } else {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(newQuote);
      localStorage.setItem(
        "dailyQuote",
        JSON.stringify({ quote: newQuote, date: today })
      );
    }
  }, []);

  return (
    <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg border border-blue-200">
      <p className="text-lg font-medium text-gray-700">"{quote}"</p>
    </div>
  );
};

const MiniCalendar = ({ streaks }) => {
  const calendarData = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const todayDate = now.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return {
      month,
      year,
      todayDate,
      monthNames,
      daysOfWeek,
      firstDayOfMonth,
      daysInMonth,
    };
  }, []);

  const {
    month,
    year,
    todayDate,
    monthNames,
    daysOfWeek,
    firstDayOfMonth,
    daysInMonth,
  } = calendarData;

  return (
    <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-white/20 h-full">
      <h3 className="font-semibold text-gray-700 mb-2">
        {monthNames[month]} {year}
      </h3>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
        {daysOfWeek.map((day, index) => (
          <div key={`${day}-${index}`}>{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;
          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const isStreaked = streaks.includes(dateStr);
          const isToday = day === todayDate;
          const classes = `calendar-day w-7 h-7 flex items-center justify-center text-sm
                        ${
                          isStreaked
                            ? "bg-indigo-500 text-white rounded-full"
                            : ""
                        }
                        ${
                          isToday ? "ring-2 ring-indigo-500 rounded-full" : ""
                        }`;
          return (
            <div key={day} className={classes}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Lesson = ({ lesson, isCompleted, onToggle }) => (
  <div
    className={`flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-indigo-50/50 transition-colors ${
      isCompleted ? "completed-lesson" : ""
    }`}
  >
    <div className="flex items-center min-w-0">
      <input
        type="checkbox"
        className="custom-checkbox mr-4 flex-shrink-0"
        checked={isCompleted}
        onChange={onToggle}
      />
      <label
        className={`cursor-pointer text-sm truncate ${
          isCompleted ? "text-gray-400 line-through" : "text-gray-700"
        }`}
      >
        {lesson.name}
      </label>
    </div>
    <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded flex-shrink-0 ml-2">
      {lesson.duration}
    </span>
  </div>
);

const Subject = ({ subject, completedLessons, onLessonToggle, onEdit }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { completedDuration, totalDuration } = useMemo(() => {
    let completed = 0;
    const total = subject.lessons.reduce(
      (sum, l) => sum + l.durationInMinutes,
      0
    );
    subject.lessons.forEach((l) => {
      if (completedLessons[l.id]) {
        completed += l.durationInMinutes;
      }
    });
    return { completedDuration: completed, totalDuration: total };
  }, [subject.lessons, completedLessons]);

  const completedCount = useMemo(
    () => subject.lessons.filter((l) => !!completedLessons[l.id]).length,
    [subject.lessons, completedLessons]
  );

  const progress =
    subject.lessons.length > 0
      ? (completedCount / subject.lessons.length) * 100
      : 0;
  const imageLink =
    subjectImages[subject.name] ||
    "https://placehold.co/600x400/cccccc/FFFFFF?text=GATE+CSE";

  return (
    <div className="bg-white/80 rounded-2xl shadow-lg border border-white/30 backdrop-blur-sm overflow-hidden transition-all duration-300 flex flex-col">
      <img
        src={imageLink}
        alt={subject.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{subject.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {completedCount} / {subject.lessons.length} lessons
            </p>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              {formatMinutesToHM(completedDuration)} /{" "}
              {formatMinutesToHM(totalDuration)}
            </p>
          </div>
          <button
            onClick={() => onEdit(subject.name)}
            className="p-2 rounded-full hover:bg-gray-200/50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-semibold text-indigo-700 ml-3 w-16 text-right">
            {progress.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          {subject.link && (
            <a
              href={subject.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-transform transform hover:scale-105"
            >
              Course
            </a>
          )}
          <a
            href={pyqLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-sm w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition-transform transform hover:scale-105"
          >
            PYQ
          </a>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 text-indigo-600 font-semibold text-sm w-full text-left"
        >
          {isCollapsed
            ? `Show ${subject.lessons.length} Lessons`
            : "Hide Lessons"}
        </button>
      </div>
      <div
        className={`lesson-list border-t border-gray-200 ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        {subject.lessons.map((lesson) => (
          <Lesson
            key={lesson.id}
            lesson={lesson}
            isCompleted={!!completedLessons[lesson.id]}
            onToggle={() => onLessonToggle(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
};

const PacingTracker = ({
  totalLessons,
  totalCompleted,
  targetDate,
  onTargetDateChange,
  streaks,
}) => {
  const paceInfo = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const lessonsRemaining = totalLessons - totalCompleted;
    if (lessonsRemaining <= 0) {
      return {
        status: "Completed",
        color: "text-green-500",
        projection: "Congratulations!",
        requiredPace: 0,
      };
    }

    const daysRemaining = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysRemaining <= 0) {
      return {
        status: "Past Due",
        color: "text-red-500",
        projection: "Target date is in the past.",
        requiredPace: Infinity,
      };
    }

    const requiredPace = lessonsRemaining / daysRemaining;

    const firstCompletionDate =
      streaks.length > 0 ? new Date(streaks.sort()[0]) : today;
    firstCompletionDate.setHours(0, 0, 0, 0);
    const daysSinceStart = Math.max(
      1,
      Math.ceil(
        (today.getTime() - firstCompletionDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
    const currentPace = totalCompleted / daysSinceStart;

    let projection = "N/A";
    if (currentPace > 0) {
      const daysToComplete = lessonsRemaining / currentPace;
      const projectedDate = new Date();
      projectedDate.setDate(today.getDate() + daysToComplete);
      projection = projectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD format
    }

    let status = "On Track";
    let color = "text-green-500";
    if (currentPace < requiredPace * 0.9) {
      status = "Lagging Behind";
      color = "text-red-500";
    } else if (currentPace > requiredPace * 1.1) {
      status = "Ahead";
      color = "text-blue-500";
    }

    return { status, color, projection, requiredPace: requiredPace.toFixed(2) };
  }, [totalLessons, totalCompleted, targetDate, streaks]);

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-white/20">
        <h3 className="font-semibold text-gray-700">Target Date</h3>
        <input
          type="date"
          value={targetDate}
          onChange={onTargetDateChange}
          className="mt-2 p-2 border rounded-md w-full"
        />
        <p className="text-xs mt-2 text-gray-500">
          Required Pace: {paceInfo.requiredPace} lessons/day
        </p>
      </div>
      <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-white/20">
        <h3 className="font-semibold text-gray-700">Pacing Status</h3>
        <p className={`text-3xl font-bold mt-2 ${paceInfo.color}`}>
          {paceInfo.status}
        </p>
      </div>
      <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-white/20">
        <h3 className="font-semibold text-gray-700">Projected Completion</h3>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {paceInfo.projection}
        </p>
      </div>
    </div>
  );
};

const EditSubjectModal = ({ subject, isOpen, onClose, onSave }) => {
  const [lessons, setLessons] = useState([]);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (subject) {
      setLessons(JSON.parse(JSON.stringify(subject.lessons))); // Deep copy
      setLink(subject.link || "");
    }
  }, [subject]);

  if (!isOpen || !subject) return null;

  const handleLessonChange = (id, field, value) => {
    setLessons(
      lessons.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      { id: crypto.randomUUID(), name: "New Lesson", duration: "1h 0m" },
    ]);
  };

  const handleDeleteLesson = (id) => {
    setLessons(lessons.filter((l) => l.id !== id));
  };

  const handleSave = () => {
    const updatedLessons = lessons.map((l) => ({
      ...l,
      durationInMinutes: parseDurationToMinutes(l.duration),
    }));
    onSave(subject.name, updatedLessons, link);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Edit {subject.name}</h2>
        </div>
        <div className="p-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Link
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Lessons</h3>
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={lesson.name}
                  onChange={(e) =>
                    handleLessonChange(lesson.id, "name", e.target.value)
                  }
                  className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                />
                <input
                  type="text"
                  value={lesson.duration}
                  onChange={(e) =>
                    handleLessonChange(lesson.id, "duration", e.target.value)
                  }
                  className="w-28 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                />
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddLesson}
            className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            + Add Lesson
          </button>
        </div>
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  // State initialization
  const [appState, setAppState] = useState(() => {
    try {
      const savedState = localStorage.getItem("gateTrackerState");
      const defaultTargetDate = new Date();
      defaultTargetDate.setMonth(defaultTargetDate.getMonth() + 6);

      const initialState = {
        subjects: parseCourseData(courseDataRaw),
        completedLessons: {},
        dailyTarget: 5,
        streaks: [],
        targetDate: defaultTargetDate.toISOString().split("T")[0],
      };

      if (savedState) {
        const loaded = JSON.parse(savedState);
        // Ensure loaded data structure is valid
        if (loaded.subjects && loaded.completedLessons) {
          return loaded;
        }
      }
      return initialState;
    } catch (error) {
      console.error("Could not load state from local storage", error);
      const defaultTargetDate = new Date();
      defaultTargetDate.setMonth(defaultTargetDate.getMonth() + 6);
      return {
        subjects: parseCourseData(courseDataRaw),
        completedLessons: {},
        dailyTarget: 5,
        streaks: [],
        targetDate: defaultTargetDate.toISOString().split("T")[0],
      };
    }
  });

  const [editingSubjectName, setEditingSubjectName] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("gateTrackerState", JSON.stringify(appState));
    } catch (error) {
      console.error("Could not save state to local storage", error);
    }
  }, [appState]);

  const { totalLessons, totalCompleted } = useMemo(() => {
    const lessons = appState.subjects.flatMap((s) => s.lessons);
    return {
      totalLessons: lessons.length,
      totalCompleted: Object.keys(appState.completedLessons).length,
    };
  }, [appState.subjects, appState.completedLessons]);

  const overallProgress =
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;

  const currentStreak = useMemo(() => {
    const uniqueDates = [...new Set(appState.streaks)].sort();
    if (uniqueDates.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const date = new Date(uniqueDates[i]);
      date.setHours(0, 0, 0, 0);
      const diff = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    }
    if (uniqueDates.length > 0) {
      const lastDate = new Date(uniqueDates[uniqueDates.length - 1]);
      lastDate.setHours(0, 0, 0, 0);
      const diffFromToday =
        (today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
      if (diffFromToday > 1) return 0;
    }
    return streak;
  }, [appState.streaks]);

  const handleLessonToggle = useCallback((lessonId) => {
    setAppState((prevState) => {
      const newCompleted = { ...prevState.completedLessons };
      const today = getTodayString();
      let newStreaks = [...prevState.streaks];

      if (newCompleted[lessonId]) {
        const completionDate = newCompleted[lessonId].date;
        delete newCompleted[lessonId];

        const wasLastOneForDate = !Object.values(newCompleted).some(
          (lesson) => lesson.date === completionDate
        );
        if (wasLastOneForDate) {
          newStreaks = newStreaks.filter((d) => d !== completionDate);
        }
      } else {
        newCompleted[lessonId] = { date: today };
        if (!newStreaks.includes(today)) {
          newStreaks.push(today);
        }
      }
      return {
        ...prevState,
        completedLessons: newCompleted,
        streaks: newStreaks,
      };
    });
  }, []);

  const handleUpdateSubject = (subjectName, updatedLessons, updatedLink) => {
    setAppState((prevState) => {
      const newSubjects = prevState.subjects.map((s) => {
        if (s.name === subjectName) {
          return { ...s, lessons: updatedLessons, link: updatedLink };
        }
        return s;
      });
      return { ...prevState, subjects: newSubjects };
    });
  };

  const handleTargetChange = (e) => {
    let newTarget = parseInt(e.target.value, 10);
    if (isNaN(newTarget) || newTarget < 1) newTarget = 1;
    setAppState((prevState) => ({ ...prevState, dailyTarget: newTarget }));
  };

  const handleTargetDateChange = (e) => {
    setAppState((prevState) => ({ ...prevState, targetDate: e.target.value }));
  };

  const editingSubject = useMemo(
    () => appState.subjects.find((s) => s.name === editingSubjectName),
    [editingSubjectName, appState.subjects]
  );
  const dailyCompletions = useMemo(
    () =>
      Object.values(appState.completedLessons).filter(
        (c) => c.date === getTodayString()
      ).length,
    [appState.completedLessons]
  );

  return (
    <>
      <style>{`
                body { font-family: 'Inter', sans-serif; background-color: #f0f4f8; color: #1e293b; background-image: radial-gradient(#dbeafe 1px, transparent 1px); background-size: 1.5rem 1.5rem; }
                .lesson-list { transition: max-height 0.5s ease-in-out, opacity 0.3s ease-in-out; max-height: 400px; overflow-y: auto; opacity: 1; }
                .lesson-list.collapsed { max-height: 0; opacity: 0; }
                .custom-checkbox { -webkit-appearance: none; appearance: none; background-color: #fff; margin: 0; font: inherit; color: currentColor; width: 1.15em; height: 1.15em; border: 0.15em solid #cbd5e1; border-radius: 0.25em; transform: translateY(-0.075em); display: grid; place-content: center; cursor: pointer; }
                .custom-checkbox::before { content: ""; width: 0.65em; height: 0.65em; transform: scale(0); transition: 120ms transform ease-in-out; box-shadow: inset 1em 1em #4f46e5; transform-origin: bottom left; clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%); }
                .custom-checkbox:checked::before { transform: scale(1); }
            `}</style>

      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg mb-8 border border-white/30">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
              GATE CSE Progress Tracker
            </h1>
          </div>
          <MotivationalQuote />

          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium text-indigo-700">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-indigo-700">
                {overallProgress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>

          <PacingTracker
            totalLessons={totalLessons}
            totalCompleted={totalCompleted}
            targetDate={appState.targetDate}
            onTargetDateChange={handleTargetDateChange}
            streaks={appState.streaks}
          />

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <h3 className="font-semibold text-gray-700">Daily Target</h3>
              <div className="flex items-center justify-center mt-2">
                <input
                  type="number"
                  value={appState.dailyTarget}
                  onChange={handleTargetChange}
                  className="w-20 text-center p-1 border rounded-md"
                />
                <span className="ml-2 text-gray-600">lessons</span>
              </div>
              <p className="text-sm mt-2 text-gray-500">
                Completed today: {dailyCompletions}/{appState.dailyTarget}
              </p>
            </div>
            <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <h3 className="font-semibold text-gray-700">Current Streak</h3>
              <p className="text-4xl font-bold text-indigo-600 mt-2">
                {currentStreak} Day{currentStreak !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-gray-500">Keep up the momentum!</p>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appState.subjects.map((subject) => (
            <Subject
              key={subject.name}
              subject={subject}
              completedLessons={appState.completedLessons}
              onLessonToggle={handleLessonToggle}
              onEdit={setEditingSubjectName}
            />
          ))}
        </main>
        <EditSubjectModal
          isOpen={!!editingSubject}
          subject={editingSubject}
          onClose={() => setEditingSubjectName(null)}
          onSave={handleUpdateSubject}
        />
      </div>
    </>
  );
}
