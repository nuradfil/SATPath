/* ===== SATPATH CURRICULUM & THEORY (MATH + R&W) ===== */
var DOM={'Algebra':['#22a381','#11676a'],'Advanced Math':['#2b7f9c','#1d5a70'],'Problem-Solving & Data':['#2fa59f','#1c7771'],'Geometry & Trigonometry':['#3f8f7a','#2a6455']};
var CUR=[['Algebra',['Linear equations in one variable','Linear functions','Linear equations in two variables','Systems of two linear equations in two variables','Linear inequalities in one or two variables']],['Advanced Math',['Nonlinear functions','Nonlinear equations in one variable','Systems of equations in two variables','Equivalent expressions']],['Problem-Solving & Data',['Ratios, rates, and units','Percentages','One-variable data','Two-variable data & scatterplots','Probability','Inference & margin of error','Evaluating statistical claims']],['Geometry & Trigonometry',['Area and volume','Lines, angles, and triangles','Right triangles and trigonometry','Circles']]];
var TYPES=[{k:'theory',l:'Theory',i:'<img class="ui-ic-sm" src="book.png" alt="">'},{k:'easy',l:'Easy',i:'<img class="ui-ic-sm" src="book.png" alt="">'},{k:'medium',l:'Medium',i:'<img class="ui-ic-sm" src="book.png" alt="">'},{k:'hard',l:'Hard',i:'<img class="ui-ic-sm" src="book.png" alt="">'},{k:'final',l:'Final exam',i:'<img class="ui-ic-sm" src="lord.png" alt="">'}];
var TOPS=[];CUR.forEach(function(d){d[1].forEach(function(n){TOPS.push(n)})});
var RDOM={'Information and Ideas':DOM['Algebra'],'Craft and Structure':DOM['Advanced Math'],'Expression of Ideas':DOM['Problem-Solving & Data'],'Standard English Conventions':DOM['Geometry & Trigonometry']};
var RCUR=[['Information and Ideas',['Central Ideas and Details','Inferences','Command of Evidence']],['Craft and Structure',['Words in Context','Text Structure and Purpose','Cross-Text Connections']],['Expression of Ideas',['Rhetorical Synthesis','Transitions']],['Standard English Conventions',['Boundaries','Form, Structure, and Sense']]];
var RTOPS=[];RCUR.forEach(function(d){d[1].forEach(function(n){RTOPS.push(n)})});

var THEORY=[];

THEORY[0] = `<h3>1. What Is a Linear Equation?</h3>
    <p>
      A linear equation in one variable is an equation that contains one
      variable, usually x, whose highest power is 1. The goal is to find
      every value of x that makes the equation true.
    </p>

    <div class="bg-[#f0fbf8] p-3 rounded-lg text-center font-mono text-lg my-3 font-bold border border-[#cfe8e2]">
      ax + b = c
    </div>

    <p>
      Here, a, b, and c are constants, and a is not zero in this standard
      form. A linear equation can also contain parentheses, fractions,
      decimals, and x on both sides.
    </p>

    <p>
      <b>Important:</b> An equation contains an equals sign. Solving it
      means finding the value or values that make its left side equal
      its right side.
    </p>

    <h3>2. The Golden Rule: Keep Both Sides Balanced</h3>

    <p>
      An equation works like a balanced scale. Whatever operation you
      perform on one side must also be performed on the other side.
      This preserves equality.
    </p>

    <ul>
      <li>Add the same number to both sides.</li>
      <li>Subtract the same number from both sides.</li>
      <li>Multiply both sides by the same number.</li>
      <li>Divide both sides by the same nonzero number.</li>
    </ul>

    <p>
      The objective is to isolate x: get x by itself on one side of
      the equation.
    </p>

    <h3>3. The Four Inverse Operations</h3>

    <p>
      Inverse operations undo each other. Use them in reverse order
      to isolate the variable.
    </p>

    <div class="border border-[#cfe8e2] bg-white p-3 rounded-xl my-3">
      <p><b>Addition and subtraction</b></p>
      <p class="font-mono text-center">x + 8 = 15</p>
      <p class="font-mono text-center">x = 15 - 8 = 7</p>

      <p><b>Multiplication and division</b></p>
      <p class="font-mono text-center">6x = 42</p>
      <p class="font-mono text-center">x = 42 / 6 = 7</p>

      <p><b>Two-step equation</b></p>
      <p class="font-mono text-center">4x - 9 = 19</p>
      <p class="font-mono text-center">4x = 28</p>
      <p class="font-mono text-center font-bold">x = 7</p>
    </div>

    <p>
      <b>Recommended order:</b> Undo addition or subtraction first,
      then undo multiplication or division.
    </p>

    <h3>4. Variables on Both Sides</h3>

    <p>
      Some equations contain x on both sides. Collect all variable
      terms on one side and all constant terms on the other.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center font-bold">
        5x + 4 = 2x + 19
      </p>
      <p>Subtract 2x from both sides:</p>
      <p class="font-mono text-center">3x + 4 = 19</p>
      <p>Subtract 4 from both sides:</p>
      <p class="font-mono text-center">3x = 15</p>
      <p class="font-mono text-center font-bold">x = 5</p>
    </div>

    <p>
      You can move terms mentally by changing their signs, but the
      underlying rule is that you are adding or subtracting the same
      quantity on both sides.
    </p>

    <h3>5. The Distributive Property</h3>

    <p>
      When a number or expression is outside parentheses, multiply
      every term inside the parentheses by it.
    </p>

    <div class="bg-[#f0fbf8] p-3 rounded-lg font-mono text-center my-3">
      a(b + c) = ab + ac
    </div>

    <p><b>Example:</b></p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">3(x + 4) = 2x + 17</p>
      <p>Distribute 3:</p>
      <p class="font-mono text-center">3x + 12 = 2x + 17</p>
      <p>Subtract 2x:</p>
      <p class="font-mono text-center">x + 12 = 17</p>
      <p class="font-mono text-center font-bold">x = 5</p>
    </div>

    <p>
      <b>Common trap:</b> 3(x + 4) is 3x + 12, not 3x + 4.
      Every term inside the parentheses must be multiplied.
    </p>

    <p>
      If a negative sign precedes parentheses, distribute the negative
      sign carefully: -(x - 6) = -x + 6.
    </p>

    <h3>6. Combining Like Terms</h3>

    <p>
      Like terms have the same variable part. You can combine 3x and 5x,
      or 7 and -2, but you cannot combine x and x² as like terms.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">4x + 3 - x + 8 = 20</p>
      <p class="font-mono text-center">3x + 11 = 20</p>
      <p class="font-mono text-center">3x = 9</p>
      <p class="font-mono text-center font-bold">x = 3</p>
    </div>

    <p>
      On the SAT, simplifying each side before solving can reduce
      unnecessary steps and prevent arithmetic mistakes.
    </p>

    <h3>7. Equations with Fractions</h3>

    <p>
      If an equation contains fractions, you can multiply every term
      on both sides by the least common denominator (LCD). This clears
      the denominators and often makes the equation easier to solve.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">x/3 + 2 = 7</p>
      <p>Subtract 2:</p>
      <p class="font-mono text-center">x/3 = 5</p>
      <p>Multiply both sides by 3:</p>
      <p class="font-mono text-center font-bold">x = 15</p>
    </div>

    <p><b>Example with multiple fractions:</b></p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">x/2 + x/3 = 10</p>
      <p>The LCD of 2 and 3 is 6. Multiply every term by 6:</p>
      <p class="font-mono text-center">3x + 2x = 60</p>
      <p class="font-mono text-center">5x = 60</p>
      <p class="font-mono text-center font-bold">x = 12</p>
    </div>

    <p>
      <b>Watch out:</b> Multiplying by the LCD means multiplying
      every term, including terms that do not contain a fraction.
    </p>

    <h3>8. Equations with Decimals</h3>

    <p>
      Decimal equations can be solved using ordinary inverse operations.
      Alternatively, multiply every term by 10, 100, or another suitable
      power of 10 to eliminate decimals.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">0.4x + 1.2 = 4</p>
      <p>Multiply every term by 10:</p>
      <p class="font-mono text-center">4x + 12 = 40</p>
      <p class="font-mono text-center">4x = 28</p>
      <p class="font-mono text-center font-bold">x = 7</p>
    </div>

    <h3>9. Negative Numbers and Signs</h3>

    <p>
      Negative coefficients and constants are common sources of errors.
      Remember these rules:
    </p>

    <ul>
      <li>Subtracting a negative number is equivalent to adding.</li>
      <li>A negative number times a negative number is positive.</li>
      <li>A positive number times a negative number is negative.</li>
      <li>When dividing by a negative number, the sign of the quotient changes.</li>
    </ul>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">-3x + 8 = 20</p>
      <p class="font-mono text-center">-3x = 12</p>
      <p class="font-mono text-center font-bold">x = -4</p>
    </div>

    <h3>10. Special Case: No Solution</h3>

    <p>
      Some equations simplify to a false statement. In that case,
      there is no value of x that satisfies the equation.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">2x + 5 = 2x + 9</p>
      <p>Subtract 2x from both sides:</p>
      <p class="font-mono text-center">5 = 9</p>
      <p class="font-bold text-center text-red-600">No solution</p>
    </div>

    <p>
      The variable disappears, but the remaining statement is false.
      Therefore, the equation has no solution.
    </p>

    <h3>11. Special Case: Infinitely Many Solutions</h3>

    <p>
      An equation has infinitely many solutions when simplifying it
      produces a true statement that is always correct.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">3(x + 2) = 3x + 6</p>
      <p>Expand the left side:</p>
      <p class="font-mono text-center">3x + 6 = 3x + 6</p>
      <p class="font-bold text-center text-[#1f9d8a]">
        Infinitely many solutions
      </p>
    </div>

    <p>
      Both sides are identical, so every real value of x satisfies
      the equation.
    </p>

    <div class="bg-[#f0fbf8] border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p><b>Remember the three possibilities:</b></p>
      <ul>
        <li>A single solution: x = a number.</li>
        <li>No solution: a false statement, such as 4 = 9.</li>
        <li>Infinitely many solutions: an identity, such as 4 = 4.</li>
      </ul>
    </div>

    <h3>12. Equations with Unknown Coefficients</h3>

    <p>
      SAT questions may use letters such as a, b, k, or m as constants.
      You may be asked to find a constant that makes an equation have
      a specific solution or a specific number of solutions.
    </p>

    <p><b>Example:</b> The equation below has solution x = 4.</p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">kx + 3 = 19</p>
      <p>Substitute x = 4:</p>
      <p class="font-mono text-center">4k + 3 = 19</p>
      <p class="font-mono text-center">4k = 16</p>
      <p class="font-mono text-center font-bold">k = 4</p>
    </div>

    <p>
      <b>Strategy:</b> Substitute the given value, then solve for the
      unknown constant. If the question concerns the number of solutions,
      simplify the equation and compare the coefficients on both sides.
    </p>

    <h3>13. Literal Equations: Solving for Another Variable</h3>

    <p>
      A literal equation contains more than one variable. You may be
      asked to rewrite a formula so that one specific variable is isolated.
      This is the same process used to solve an equation for x.
    </p>

    <p><b>Example:</b> Solve the formula for w.</p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">P = 2l + 2w</p>
      <p>Subtract 2l:</p>
      <p class="font-mono text-center">P - 2l = 2w</p>
      <p>Divide by 2:</p>
      <p class="font-mono text-center font-bold">w = (P - 2l)/2</p>
    </div>

    <p>
      Another example is the distance formula d = rt. Solving for time
      gives t = d/r, provided r is not zero.
    </p>

    <h3>14. Turning Word Problems into Equations</h3>

    <p>
      Many SAT questions describe a situation instead of directly giving
      an equation. Define the unknown, translate the relationships into
      algebra, and then solve.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p><b>Example:</b> A gym charges a one-time registration fee of
      $15 and $8 per visit. The total cost is $71. How many visits were made?</p>
      <p>Let x be the number of visits.</p>
      <p class="font-mono text-center">15 + 8x = 71</p>
      <p class="font-mono text-center">8x = 56</p>
      <p class="font-mono text-center font-bold">x = 7 visits</p>
    </div>

    <p><b>Common translations:</b></p>

    <ul>
      <li>"A number increased by 5" means x + 5.</li>
      <li>"A number decreased by 5" means x - 5.</li>
      <li>"5 less than a number" means x - 5.</li>
      <li>"5 less than twice a number" means 2x - 5.</li>
      <li>"Twice the sum of x and 5" means 2(x + 5).</li>
      <li>"The quotient of x and 4" means x/4.</li>
      <li>"Is equal to" means an equals sign.</li>
    </ul>

    <p>
      Pay attention to the order of words. "5 less than twice x" is
      2x - 5, not 2(x - 5).
    </p>

    <h3>15. Consecutive Integers and Number Problems</h3>

    <p>
      Consecutive integers differ by 1. If the first integer is x,
      the next two are x + 1 and x + 2.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p><b>Example:</b> The sum of two consecutive integers is 41.
      Find the integers.</p>
      <p class="font-mono text-center">x + (x + 1) = 41</p>
      <p class="font-mono text-center">2x + 1 = 41</p>
      <p class="font-mono text-center">2x = 40</p>
      <p class="font-mono text-center font-bold">x = 20</p>
      <p>The integers are 20 and 21.</p>
    </div>

    <p>
      For consecutive even or odd integers, use x and x + 2.
      For three consecutive integers, use x, x + 1, and x + 2.
    </p>

    <h3>16. Rates, Money, and Real-World Relationships</h3>

    <p>
      A fixed starting amount plus a constant amount per unit often
      produces a linear equation.
    </p>

    <div class="bg-[#f0fbf8] p-3 rounded-lg font-mono text-center my-3">
      Total cost = fixed fee + (cost per unit)(number of units)
    </div>

    <p>
      Other common examples include wages, taxi fares, membership fees,
      ticket costs, and savings plans. Identify which quantity is fixed
      and which quantity changes with x.
    </p>

    <p>
      <b>Example:</b> A worker earns $18 per hour plus a $25 bonus.
      If total earnings are $151, the equation is 18x + 25 = 151,
      where x is the number of hours. Solving gives x = 7.
    </p>

    <h3>17. Understanding What the Question Actually Asks</h3>

    <p>
      Sometimes the equation is easy, but the question asks for a
      different quantity than the variable itself.
    </p>

    <ul>
      <li>If x is the number of weeks, the answer must be in weeks.</li>
      <li>If x represents dollars, include the requested monetary value.</li>
      <li>If the question asks for 2x, solve for x and then calculate 2x.</li>
      <li>If the question asks for x + 3, do not report x alone.</li>
    </ul>

    <p><b>Example:</b> If 3x + 2 = 20, then x = 6.
    If the question asks for x + 4, the answer is 10, not 6.</p>

    <h3>18. Checking Your Answer</h3>

    <p>
      Substitute your answer into the original equation. Both sides
      must have the same value. Checking is especially helpful when
      negative numbers, fractions, or parentheses are involved.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">2x + 7 = 21</p>
      <p>Solution: x = 7</p>
      <p>Substitute:</p>
      <p class="font-mono text-center">2(7) + 7 = 14 + 7 = 21</p>
      <p class="font-bold text-center text-[#1f9d8a]">
        Correct: both sides equal 21.
      </p>
    </div>

    <h3>19. Common SAT Mistakes</h3>

    <ul>
      <li>Changing a sign incorrectly when moving terms.</li>
      <li>Distributing a factor to only one term inside parentheses.</li>
      <li>Forgetting to multiply every term by the LCD.</li>
      <li>Dividing by a coefficient before isolating the other terms.</li>
      <li>Confusing no solution with infinitely many solutions.</li>
      <li>Solving correctly but answering the wrong requested quantity.</li>
      <li>Ignoring units or the real-world meaning of the variable.</li>
      <li>Rounding a value when the question expects an exact answer.</li>
    </ul>

    <h3>20. A Reliable SAT Solving Checklist</h3>

    <div class="bg-[#f0fbf8] border border-[#cfe8e2] rounded-xl p-3 my-3">
      <ol class="list-decimal pl-5 space-y-2">
        <li>Identify the unknown and what the question asks for.</li>
        <li>Expand parentheses and simplify like terms.</li>
        <li>Clear fractions or decimals if that makes the equation easier.</li>
        <li>Collect variable terms on one side.</li>
        <li>Collect constant terms on the other side.</li>
        <li>Divide by the coefficient of the variable.</li>
        <li>Check whether there is one solution, no solution, or infinitely many.</li>
        <li>Substitute the result into the original equation.</li>
        <li>Answer in the requested form and include units when needed.</li>
      </ol>
    </div>

    <h3>21. Final SAT Practice Examples</h3>

    <div class="border border-[#cfe8e2] bg-white p-3 rounded-xl my-3">
      <p><b>Example A</b></p>
      <p class="font-mono text-center">7x - 11 = 3x + 17</p>
      <p class="font-mono text-center">4x = 28</p>
      <p class="font-mono text-center font-bold">x = 7</p>
    </div>

    <div class="border border-[#cfe8e2] bg-white p-3 rounded-xl my-3">
      <p><b>Example B</b></p>
      <p class="font-mono text-center">2(3x - 4) = 4x + 10</p>
      <p class="font-mono text-center">6x - 8 = 4x + 10</p>
      <p class="font-mono text-center">2x = 18</p>
      <p class="font-mono text-center font-bold">x = 9</p>
    </div>

    <div class="border border-[#cfe8e2] bg-white p-3 rounded-xl my-3">
      <p><b>Example C</b></p>
      <p class="font-mono text-center">5(x - 2) = 5x + 1</p>
      <p class="font-mono text-center">5x - 10 = 5x + 1</p>
      <p class="font-mono text-center">-10 = 1</p>
      <p class="font-bold text-center text-red-600">No solution</p>
    </div>

    <div class="border border-[#cfe8e2] bg-white p-3 rounded-xl my-3">
      <p><b>Example D</b></p>
      <p class="font-mono text-center">4(x + 3) = 4x + 12</p>
      <p class="font-mono text-center">4x + 12 = 4x + 12</p>
      <p class="font-bold text-center text-[#1f9d8a]">
        Infinitely many solutions
      </p>
    </div>

    <div class="bg-[#d9f0ea] border-2 border-[#1f9d8a] p-4 rounded-xl my-4">
      <p class="font-bold text-lg">Key Takeaway</p>
      <p>
        Most linear equations in one variable can be solved by simplifying
        both sides and using inverse operations to isolate the variable.
        On the SAT, the hardest part is often recognizing the structure
        of the equation, translating a word problem correctly, or
        interpreting a special case.
      </p>
    </div>

  </div>
`
THEORY[1] = `
  <div class="space-y-4">
    <section>
      <h3 class="font-bold text-lg">1. What Is a Linear Function?</h3>
      <p>A linear function has a constant rate of change and can be written as:</p>
      <p class="font-mono bg-muted p-2 rounded">f(x) = mx + b</p>
      <ul class="list-disc pl-5">
        <li><b>m</b> — slope (rate of change).</li>
        <li><b>b</b> — y-intercept, the value of f(x) when x = 0.</li>
      </ul>
      <p>Its graph is a straight line.</p>
    </section>

    <section>
      <h3 class="font-bold text-lg">2. Slope and Rate of Change</h3>
      <p>The slope measures how much y changes when x increases by 1.</p>
      <p class="font-mono bg-muted p-2 rounded">
        m = (y₂ - y₁) / (x₂ - x₁)
      </p>
      <ul class="list-disc pl-5">
        <li>m &gt; 0: the function increases.</li>
        <li>m &lt; 0: the function decreases.</li>
        <li>m = 0: the function is constant.</li>
      </ul>
      <p><b>Example:</b> If f(2) = 7 and f(5) = 16, then m = (16 - 7) / (5 - 2) = 3.</p>
    </section>

    <section>
      <h3 class="font-bold text-lg">3. Finding the Equation</h3>
      <p>Use f(x) = mx + b. Substitute a known point to find b.</p>
      <p><b>Example:</b> A line has slope 2 and passes through (3, 10).</p>
      <p>10 = 2(3) + b, so b = 4.</p>
      <p class="font-mono bg-muted p-2 rounded">f(x) = 2x + 4</p>
    </section>

    <section>
      <h3 class="font-bold text-lg">4. Function Values</h3>
      <p>To find f(a), substitute a for x.</p>
      <p><b>Example:</b> If f(x) = 4x - 3, then f(5) = 4(5) - 3 = 17.</p>
      <p>To find x when f(x) is given, solve the equation.</p>
    </section>

    <section>
      <h3 class="font-bold text-lg">5. Tables and Graphs</h3>
      <p>For a linear function, the rate of change between any two points is constant.</p>
      <p>Check whether the change in y divided by the change in x is the same for all pairs of points.</p>
      <p>On a graph, the y-intercept is where the line crosses the y-axis.</p>
    </section>

    <section>
      <h3 class="font-bold text-lg">6. Interpreting Linear Models</h3>
      <p>In a real-world model f(x) = mx + b:</p>
      <ul class="list-disc pl-5">
        <li><b>m:</b> change per unit.</li>
        <li><b>b:</b> starting value when x = 0.</li>
      </ul>
      <p><b>Example:</b> A taxi charges $4 plus $2 per mile. The cost is C(x) = 2x + 4.</p>
      <p>The slope 2 is the cost per mile; the intercept 4 is the initial fee.</p>
    </section>

    <section>
      <h3 class="font-bold text-lg">7. SAT Quick Check</h3>
      <ul class="list-disc pl-5">
        <li>Identify the slope and y-intercept.</li>
        <li>Calculate slope from two points or a table.</li>
        <li>Find a missing coefficient using a known point.</li>
        <li>Interpret slope and intercept in context.</li>
        <li>Remember: f(x) is the output, not multiplication of f and x.</li>
      </ul>
    </section>
  </div>
`
THEORY[2] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">

    <h3>1. What Is a Linear Equation in Two Variables?</h3>

    <p>
      A linear equation in two variables contains two variables, usually
      x and y, each raised only to the first power. Its graph is a
      straight line.
    </p>

    <div class="bg-[#f0fbf8] p-3 rounded-lg text-center font-mono text-lg my-3 font-bold border border-[#cfe8e2]">
      Ax + By = C
    </div>

    <p>
      A, B, and C are constants, and A and B cannot both be zero.
      A solution is an ordered pair (x, y) that makes the equation true.
    </p>

    <h3>2. Slope-Intercept Form</h3>

    <div class="bg-[#f0fbf8] p-3 rounded-lg text-center font-mono text-lg my-3 font-bold border border-[#cfe8e2]">
      y = mx + b
    </div>

    <ul>
      <li><b>m</b> is the slope: how much y changes when x increases by 1.</li>
      <li><b>b</b> is the y-intercept: the value of y when x = 0.</li>
      <li>The graph is a straight line.</li>
    </ul>

    <p><b>Example:</b> For y = 3x - 4, the slope is 3 and the y-intercept is -4.</p>

    <h3>3. Finding the Slope</h3>

    <p>
      Given two points (x₁, y₁) and (x₂, y₂), calculate the slope using:
    </p>

    <div class="bg-[#f0fbf8] p-3 rounded-lg text-center font-mono text-lg my-3 font-bold border border-[#cfe8e2]">
      m = (y₂ - y₁) / (x₂ - x₁)
    </div>

    <p>
      <b>Example:</b> Find the slope between (2, 5) and (4, 11).
    </p>

    <p class="font-mono text-center">
      m = (11 - 5) / (4 - 2) = 3
    </p>

    <ul>
      <li>Positive slope: the line rises from left to right.</li>
      <li>Negative slope: the line falls from left to right.</li>
      <li>Zero slope: horizontal line, y = constant.</li>
      <li>Undefined slope: vertical line, x = constant.</li>
    </ul>

    <h3>4. Converting to Slope-Intercept Form</h3>

    <p>
      To identify the slope and y-intercept, rewrite the equation as y = mx + b.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">2x + 4y = 12</p>
      <p class="font-mono text-center">4y = -2x + 12</p>
      <p class="font-mono text-center font-bold">y = -½x + 3</p>
      <p>The slope is -½, and the y-intercept is 3.</p>
    </div>

    <h3>5. Finding Intercepts</h3>

    <p>
      The x-intercept occurs where y = 0. The y-intercept occurs where x = 0.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p class="font-mono text-center">2x + 3y = 12</p>
      <p>For the x-intercept, set y = 0: x = 6, so the point is (6, 0).</p>
      <p>For the y-intercept, set x = 0: y = 4, so the point is (0, 4).</p>
    </div>

    <h3>6. Writing an Equation of a Line</h3>

    <p>
      If you know the slope m and one point (x₁, y₁), use point-slope form:
    </p>

    <div class="bg-[#f0fbf8] p-3 rounded-lg text-center font-mono text-lg my-3 font-bold border border-[#cfe8e2]">
      y - y₁ = m(x - x₁)
    </div>

    <p><b>Example:</b> A line has slope 2 and passes through (3, 7).</p>

    <p class="font-mono text-center">y - 7 = 2(x - 3)</p>
    <p class="font-mono text-center font-bold">y = 2x + 1</p>

    <h3>7. Parallel and Perpendicular Lines</h3>

    <ul>
      <li><b>Parallel lines</b> have the same slope and different intercepts.</li>
      <li><b>Perpendicular nonvertical lines</b> have slopes that are negative reciprocals.</li>
    </ul>

    <p>
      For example, a line with slope 2 is perpendicular to a line with
      slope -½. A horizontal line is perpendicular to a vertical line.
    </p>

    <h3>8. Interpreting Linear Models</h3>

    <p>
      SAT questions often describe a real-world situation using a linear equation.
      The slope represents the rate of change, while the y-intercept represents
      the initial value when x = 0.
    </p>

    <div class="bg-white border border-[#cfe8e2] rounded-xl p-3 my-3">
      <p>
        A bike rental costs $8 initially and $5 per hour. Let x be the number
        of hours and y be the total cost.
      </p>
      <p class="font-mono text-center font-bold">y = 5x + 8</p>
      <p>The hourly rate is $5, and the initial fee is $8.</p>
    </div>

    <h3>9. Solutions and Graphs</h3>

    <p>
      Every point on the graph of a linear equation is a solution.
      To check whether a point lies on the line, substitute its x- and
      y-coordinates into the equation.
    </p>

    <p>
      For example, (2, 5) satisfies y = 2x + 1 because 5 = 2(2) + 1.
    </p>

    <h3>10. Common SAT Mistakes</h3>

    <ul>
      <li>Confusing the slope with the y-intercept.</li>
      <li>Reversing the order of subtraction in the slope formula.</li>
      <li>Forgetting to divide every term when isolating y.</li>
      <li>Setting x = 0 for the x-intercept instead of y = 0.</li>
      <li>Mixing up the rate of change and the initial value.</li>
      <li>Assuming every line has a defined slope: vertical lines do not.</li>
      <li>Reporting an intercept as a number when the question asks for a point.</li>
    </ul>

    <div class="bg-[#d9f0ea] border-2 border-[#1f9d8a] p-4 rounded-xl my-4">
      <p class="font-bold text-lg">SAT Quick Checklist</p>
      <ul>
        <li>Recognize standard form and slope-intercept form.</li>
        <li>Find slope from an equation, graph, table, or two points.</li>
        <li>Identify x- and y-intercepts.</li>
        <li>Write a line equation from a slope and a point.</li>
        <li>Interpret slope and intercepts in context.</li>
        <li>Check whether a point satisfies an equation.</li>
      </ul>
    </div>

  </div>
`
THEORY[3] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">

    <h3 class="text-[#1f9d8a] font-bold text-lg mb-2">
      1. What is a system of linear equations?
    </h3>

    <p>
      A system of two linear equations in two variables consists of
      two equations containing the same variables, usually x and y.
      The solution is an ordered pair (x, y) that makes
      <b> both equations true at the same time.</b>
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      <div>y = 2x + 1</div>
      <div>y = −x + 7</div>
      <div class="text-[#1f9d8a] font-bold mt-2">
        Solution: (2, 5)
      </div>
    </div>

    <p>
      Check: when x = 2 and y = 5, both equations are true.
      On a graph, the solution is the point where the two lines intersect.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      2. Method 1: Substitution
    </h3>

    <p>
      Use substitution when one equation already has a variable
      isolated, such as y = 3x − 2, or when a variable is easy to isolate.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg font-mono text-center my-3">
      <div>y = 2x + 1</div>
      <div>y = x + 4</div>
      <div class="my-2 text-gray-500">Set the expressions equal:</div>
      <div>2x + 1 = x + 4</div>
      <div>x = 3</div>
      <div>y = 2(3) + 1 = 7</div>
      <div class="text-[#1f9d8a] font-bold mt-2">
        Solution: (3, 7)
      </div>
    </div>

    <p class="bg-white/50 border-l-4 border-[#1f9d8a] p-2 mt-3">
      <b>SAT tip:</b> If both equations equal y, set their right-hand
      sides equal. Solve for x, then substitute x into either
      original equation to find y.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      3. Method 2: Elimination
    </h3>

    <p>
      Elimination removes one variable by adding or subtracting
      the equations. It is especially useful when the coefficients
      of one variable are equal or opposites.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg font-mono text-center my-3">
      <div>2x + y = 11</div>
      <div>x − y = 1</div>
      <div class="my-2 text-gray-500">Add the equations:</div>
      <div>3x = 12</div>
      <div>x = 4</div>
      <div>4 − y = 1</div>
      <div>y = 3</div>
      <div class="text-[#1f9d8a] font-bold mt-2">
        Solution: (4, 3)
      </div>
    </div>

    <p>When coefficients do not match, multiply one or both
      equations to make them equal or opposite.</p>

    <div class="bg-white/50 border-l-4 border-[#1f9d8a] p-2 mt-3">
      <b>Example:</b>
      <div class="font-mono mt-2">
        2x + 3y = 12<br/>
        4x − 3y = 6
      </div>
      Add the equations to eliminate y:
      <div class="font-mono mt-2">
        6x = 18<br/>
        x = 3<br/>
        2(3) + 3y = 12<br/>
        y = 2
      </div>
      <b>Solution: (3, 2)</b>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      4. Writing equations in standard form
    </h3>

    <p>
      A common form of a linear equation is:
    </p>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg text-center font-bold text-base my-3">
      Ax + By = C
    </div>

    <p>
      A, B, and C are constants. To solve a system, it is often
      helpful to rewrite both equations in standard form.
    </p>

    <div class="bg-gray-50 p-3 rounded-lg font-mono text-center my-3">
      <div>y = 2x + 5</div>
      <div class="my-1">−2x + y = 5</div>
      <div class="text-gray-500 text-xs mt-2">
        Subtract 2x from both sides.
      </div>
    </div>

    <p>
      Be careful with negative signs when moving terms from one
      side to the other. Multiplying or dividing an entire equation
      by a nonzero number does not change its solutions.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      5. Three possible outcomes
    </h3>

    <p>
      A system can have exactly one solution, no solution,
      or infinitely many solutions. These cases depend on the
      relationship between the two lines.
    </p>

    <div class="bg-white border border-gray-200 p-3 rounded-lg my-3">
      <div class="font-bold text-[#1f9d8a] mb-1">
        Case 1: One solution
      </div>
      <p>Two distinct lines intersect at one point.</p>
      <div class="font-mono text-center my-2">
        y = 2x + 1<br/>
        y = −x + 7
      </div>
      <p>Different slopes → one intersection → one solution.</p>
    </div>

    <div class="bg-white border border-gray-200 p-3 rounded-lg my-3">
      <div class="font-bold text-[#c0392b] mb-1">
        Case 2: No solution
      </div>
      <p>
        The lines are parallel: they have the same slope but
        different y-intercepts.
      </p>
      <div class="font-mono text-center my-2">
        y = 3x + 2<br/>
        y = 3x − 4
      </div>
      <p>
        The equations contradict each other, so no ordered pair
        satisfies both.
      </p>
    </div>

    <div class="bg-white border border-gray-200 p-3 rounded-lg my-3">
      <div class="font-bold text-[#1f9d8a] mb-1">
        Case 3: Infinitely many solutions
      </div>
      <p>
        Both equations represent the same line. One equation
        can be obtained by multiplying the other by a nonzero constant.
      </p>
      <div class="font-mono text-center my-2">
        2x + y = 8<br/>
        4x + 2y = 16
      </div>
      <p>
        Both equations describe the same line, so every point
        on that line is a solution.
      </p>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      6. Recognizing the number of solutions algebraically
    </h3>

    <p>
      For equations in standard form, compare the coefficients
      of x and y and the constants.
    </p>

    <div class="overflow-x-auto my-3">
      <table class="w-full border-collapse text-xs">
        <thead>
          <tr class="bg-[#eaf7f5]">
            <th class="border border-gray-200 p-2 text-left">Condition</th>
            <th class="border border-gray-200 p-2 text-left">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-200 p-2">
              Different slopes
            </td>
            <td class="border border-gray-200 p-2">
              One solution
            </td>
          </tr>
          <tr>
            <td class="border border-gray-200 p-2">
              Same slope, different intercepts
            </td>
            <td class="border border-gray-200 p-2">
              No solution
            </td>
          </tr>
          <tr>
            <td class="border border-gray-200 p-2">
              Equivalent equations
            </td>
            <td class="border border-gray-200 p-2">
              Infinitely many solutions
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      For equations Ax + By = C and Dx + Ey = F, the coefficient
      pairs (A, B) and (D, E) determine whether the lines have
      the same direction. If A/D = B/E but C/F is different,
      the lines are parallel. If all three ratios are equal,
      the equations are equivalent. Use these ratios only when
      the denominators are nonzero; otherwise compare by cross-multiplication.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      7. Systems with parameters
    </h3>

    <p>
      SAT questions may contain a constant such as k or a.
      You may be asked to find the value that produces no solution,
      infinitely many solutions, or a particular solution.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg font-mono text-center my-3">
      <div>y = 4x + 2</div>
      <div>y = 4x + k</div>
    </div>

    <ul class="list-disc pl-5 mb-3">
      <li>One solution: never, because the slopes are equal.</li>
      <li>No solution: k ≠ 2.</li>
      <li>Infinitely many solutions: k = 2.</li>
    </ul>

    <p>
      <b>Important:</b> Equal slopes alone do not guarantee
      infinitely many solutions. The intercepts must also be equal.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      8. Finding a parameter from a known solution
    </h3>

    <p>
      If the system has a known solution, substitute its coordinates
      into the equations to determine the unknown constant.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg font-mono text-center my-3">
      <div>y = 2x + a</div>
      <div>3x + y = 14</div>
      <div class="my-2 text-gray-500">
        The solution is (3, 2).
      </div>
      <div>2 = 2(3) + a</div>
      <div>2 = 6 + a</div>
      <div class="text-[#1f9d8a] font-bold">a = −4</div>
    </div>

    <p>
      Always substitute both coordinates in the correct order:
      x first, y second.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      9. Systems and graphs
    </h3>

    <p>
      When equations are written as y = mx + b, m is the slope
      and b is the y-intercept.
    </p>

    <ul class="list-disc pl-5 mb-3">
      <li>
        <b>Different slopes:</b> the lines intersect once.
      </li>
      <li>
        <b>Equal slopes and different intercepts:</b> parallel lines.
      </li>
      <li>
        <b>Equal slopes and equal intercepts:</b> the same line.
      </li>
    </ul>

    <p>
      The solution is the intersection point, not the x-intercept
      or y-intercept unless that point is actually shared by both lines.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      10. Word problems: translating into a system
    </h3>

    <p>
      Many SAT questions describe two unknown quantities and give
      two relationships between them. Define variables, write two
      equations, and solve the system.
    </p>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg my-3">
      <p class="font-bold mb-2">Example: Tickets</p>
      <p>
        Adult tickets cost $12 and student tickets cost $8.
        A total of 10 tickets cost $104. How many adult tickets
        were purchased?
      </p>
      <div class="font-mono text-center my-3">
        x + y = 10<br/>
        12x + 8y = 104
      </div>
      <p>Multiply the first equation by 8:</p>
      <div class="font-mono text-center my-2">
        8x + 8y = 80<br/>
        12x + 8y = 104
      </div>
      <p>Subtract the first new equation from the second:</p>
      <div class="font-mono text-center my-2">
        4x = 24<br/>
        x = 6
      </div>
      <p class="font-bold text-[#1f9d8a]">
        Answer: 6 adult tickets.
      </p>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      11. Common SAT word-problem models
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li>
        <b>Two numbers:</b> x + y = sum; x − y = difference.
      </li>
      <li>
        <b>Prices and quantities:</b> number of items and total cost.
      </li>
      <li>
        <b>Tickets:</b> total tickets and total revenue.
      </li>
      <li>
        <b>Ages:</b> present ages and relationships between ages.
      </li>
      <li>
        <b>Distance:</b> distance = rate × time, combined with another relationship.
      </li>
      <li>
        <b>Mixtures:</b> total amount and total value or concentration.
      </li>
      <li>
        <b>Geometry:</b> perimeter or other linear relationships involving unknown dimensions.
      </li>
    </ul>

    <p>
      Translate each sentence into an equation. Pay special attention
      to words such as total, difference, twice, per, and combined.
      Check that the units on both sides of each equation match.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      12. Systems involving fractions and decimals
    </h3>

    <p>
      Fractions and decimals do not change the basic method.
      You can multiply an entire equation by a common denominator
      to remove fractions or scale decimals to simplify calculations.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg font-mono text-center my-3">
      <div>0.5x + y = 7</div>
      <div>x − y = 2</div>
      <div class="my-2 text-gray-500">Multiply the first equation by 2:</div>
      <div>x + 2y = 14</div>
      <div>x − y = 2</div>
      <div class="my-2">Subtract the second from the first:</div>
      <div>3y = 12</div>
      <div>y = 4, x = 6</div>
      <div class="text-[#1f9d8a] font-bold mt-2">
        Solution: (6, 4)
      </div>
    </div>

    <p>
      Multiplying an equation by a nonzero number preserves its
      solution set. Avoid rounding intermediate values unless the
      question specifically requires an approximation.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      13. Checking a solution
    </h3>

    <p>
      After solving, substitute the ordered pair into both original
      equations. A correct solution must satisfy both equations,
      not just one.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg my-3">
      <p class="font-bold">Example: Is (2, 3) a solution?</p>
      <div class="font-mono text-center my-2">
        x + y = 5<br/>
        2x − y = 1
      </div>
      <div class="font-mono text-center">
        2 + 3 = 5 ✓<br/>
        2(2) − 3 = 1 ✓
      </div>
      <p class="text-[#1f9d8a] font-bold mt-2">
        Yes, (2, 3) is a solution.
      </p>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      14. Common SAT traps
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li>
        <b>Stopping after finding x:</b> unless the question asks
        only for x, find the complete ordered pair.
      </li>
      <li>
        <b>Sign errors:</b> when subtracting equations, subtract
        every term, including negative terms.
      </li>
      <li>
        <b>Confusing x and y:</b> the solution is written as (x, y).
      </li>
      <li>
        <b>Assuming every system has one solution:</b> some have
        no solution or infinitely many solutions.
      </li>
      <li>
        <b>Using only one equation:</b> a candidate must satisfy both.
      </li>
      <li>
        <b>Ignoring units:</b> in word problems, distinguish
        the number of items from their total cost.
      </li>
      <li>
        <b>Incorrect parameter reasoning:</b> equal slopes mean
        either no solution or infinitely many solutions, depending
        on the intercepts.
      </li>
      <li>
        <b>Rounding too early:</b> keep exact values during calculations.
      </li>
    </ul>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      15. SAT strategy: choosing the fastest method
    </h3>

    <div class="bg-white border border-gray-200 rounded-lg p-3 my-3">
      <p class="mb-2">
        <b>Use substitution when:</b>
      </p>
      <ul class="list-disc pl-5 mb-3">
        <li>A variable is already isolated.</li>
        <li>A variable has coefficient 1 or −1.</li>
        <li>One equation is given as y = mx + b.</li>
      </ul>

      <p class="mb-2">
        <b>Use elimination when:</b>
      </p>
      <ul class="list-disc pl-5 mb-3">
        <li>Coefficients are equal or opposites.</li>
        <li>Multiplication can quickly match coefficients.</li>
        <li>The problem asks for a sum or difference of variables.</li>
      </ul>

      <p class="mb-2">
        <b>Use graph interpretation when:</b>
      </p>
      <ul class="list-disc pl-5">
        <li>The graph is already provided.</li>
        <li>You need the intersection point.</li>
        <li>The question asks about the number of solutions.</li>
      </ul>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      16. Final SAT checklist
    </h3>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg my-3">
      <ul class="list-disc pl-5">
        <li>I can solve systems using substitution.</li>
        <li>I can solve systems using elimination.</li>
        <li>I can identify one, zero, or infinitely many solutions.</li>
        <li>I can recognize parallel and identical lines.</li>
        <li>I can solve for unknown constants and parameters.</li>
        <li>I can interpret intersections on a graph.</li>
        <li>I can translate word problems into two equations.</li>
        <li>I can verify answers in both original equations.</li>
      </ul>
    </div>

    <p class="italic opacity-80 mt-3 bg-white/50 p-2 border-l-4 border-[#1f9d8a]">
      SAT golden rule: A solution to a system must make both
      equations true simultaneously. If the equations represent
      intersecting lines, the solution is their intersection.
      If they represent parallel lines, there is no solution.
      If they represent the same line, there are infinitely many.
    </p>

  </div>
`
THEORY[4] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">

    <h3 class="text-[#1f9d8a] font-bold text-lg mb-2">
      1. Solving linear inequalities
    </h3>

    <p>
      Solve inequalities like equations by adding, subtracting,
      multiplying, or dividing both sides. The key rule is:
    </p>

    <div class="bg-[#fdf3f2] border border-[#fadbd8] p-3 rounded-lg text-center font-bold my-3 text-[#c0392b]">
      When multiplying or dividing by a NEGATIVE number,
      flip the inequality sign.
    </div>

    <div class="font-mono text-center my-2 text-sm bg-gray-50 p-3 rounded">
      −3x + 5 &lt; 14<br/>
      −3x &lt; 9<br/>
      <b>x &gt; −3</b>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      2. Understanding inequality symbols
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li><b>&lt; or &gt;</b> — boundary is not included.</li>
      <li><b>≤ or ≥</b> — boundary is included.</li>
      <li><b>At most</b> means ≤.</li>
      <li><b>At least</b> means ≥.</li>
      <li><b>More than / less than</b> means &gt; / &lt;.</li>
    </ul>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      3. Compound inequalities
    </h3>

    <p>
      A compound inequality combines two inequalities.
      If a variable must be between two values, solve all three
      parts together.
    </p>

    <div class="font-mono text-center my-3 bg-gray-50 p-3 rounded">
      2 &lt; x + 3 ≤ 8<br/>
      −1 &lt; x ≤ 5
    </div>

    <p>
      The solution includes numbers greater than −1 and less
      than or equal to 5.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      4. Inequalities in two variables
    </h3>

    <p>
      An inequality such as y &gt; mx + b describes a region
      on the coordinate plane, not just a single line.
    </p>

    <ul class="list-disc pl-5 mb-3">
      <li><b>y &gt; mx + b:</b> region above the line.</li>
      <li><b>y &lt; mx + b:</b> region below the line.</li>
      <li><b>≤ or ≥:</b> solid boundary line.</li>
      <li><b>&lt; or &gt;:</b> dashed boundary line.</li>
    </ul>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center my-3">
      <div class="font-mono">
        y ≥ 2x − 1
      </div>
      <p class="mt-2">
        Draw the solid line y = 2x − 1 and shade the region above it.
      </p>
    </div>

    <p>
      To check whether a point (x, y) is a solution, substitute
      its coordinates into the inequality. If the statement is true,
      the point belongs to the solution region.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      5. Systems of inequalities
    </h3>

    <p>
      A system of inequalities requires all inequalities to be true
      at the same time. Its solution is the overlapping region.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      y &gt; x + 1<br/>
      y ≤ −x + 5
    </div>

    <p>
      The solution consists of points above the first line and
      on or below the second line. A point must satisfy both
      inequalities to be a solution.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      6. Word problems on the SAT
    </h3>

    <p>
      Translate phrases into inequalities:
    </p>

    <ul class="list-disc pl-5 mb-3">
      <li>At most $50: x ≤ 50.</li>
      <li>At least 10: x ≥ 10.</li>
      <li>More than 20: x &gt; 20.</li>
      <li>Fewer than 8: x &lt; 8.</li>
    </ul>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg my-3">
      <p class="font-bold mb-2">Example</p>
      <p>
        A ticket costs $12. You have at most $60.
        What is the greatest number of tickets you can buy?
      </p>
      <div class="font-mono text-center my-2">
        12x ≤ 60<br/>
        x ≤ 5
      </div>
      <p class="font-bold text-[#1f9d8a]">
        Answer: 5 tickets.
      </p>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      7. Common SAT mistakes
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li>Forgetting to flip the sign when dividing by a negative.</li>
      <li>Using a dashed line for ≤ or ≥ instead of a solid line.</li>
      <li>Shading the wrong side of a boundary line.</li>
      <li>Forgetting that a system requires every inequality to hold.</li>
      <li>Rounding incorrectly in word problems involving whole items.</li>
    </ul>

    <p class="italic opacity-80 mt-3 bg-white/50 p-2 border-l-4 border-[#1f9d8a]">
      SAT tip: After solving, check the sign, boundary inclusion,
      and whether the answer must be a whole number. For inequalities
      in two variables, remember that the answer is usually a region
      of the coordinate plane.
    </p>

  </div>
`
THEORY[5]= `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">

    <h3 class="text-[#1f9d8a] font-bold text-lg mb-2">
      1. What are nonlinear functions?
    </h3>

    <p>
      A nonlinear function is a function whose graph is not a straight
      line. Unlike linear functions, nonlinear functions may contain
      powers such as x², square roots, or variables in denominators.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg my-3">
      <div class="font-mono text-center">
        <div>Linear: f(x) = 2x + 3</div>
        <div class="text-[#1f9d8a] font-bold mt-1">
          Nonlinear: f(x) = x² + 3
        </div>
        <div class="font-mono mt-1">
          f(x) = √x, f(x) = 1/x
        </div>
      </div>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      2. Quadratic functions
    </h3>

    <p>
      A quadratic function has the form:
    </p>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg text-center font-bold text-base my-3">
      f(x) = ax² + bx + c, where a ≠ 0
    </div>

    <ul class="list-disc pl-5 mb-3">
      <li>The graph is a parabola.</li>
      <li>If a &gt; 0, it opens upward.</li>
      <li>If a &lt; 0, it opens downward.</li>
      <li>The vertex is the maximum or minimum point.</li>
    </ul>

    <p>
      The x-coordinate of the vertex is:
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      x = −b / (2a)
    </div>

    <p>
      Substitute this x-value into f(x) to find the y-coordinate.
      The axis of symmetry is the vertical line x = −b/(2a).
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      3. Zeros and intercepts
    </h3>

    <p>
      The zeros or roots of a function are the x-values for which
      f(x) = 0. On a graph, they are the x-intercepts.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      f(x) = x² − 5x + 6<br/>
      0 = (x − 2)(x − 3)<br/>
      <b>x = 2 or x = 3</b>
    </div>

    <ul class="list-disc pl-5 mb-3">
      <li><b>x-intercept:</b> set f(x) = 0.</li>
      <li><b>y-intercept:</b> calculate f(0).</li>
    </ul>

    <p>
      A quadratic can have two, one, or no real x-intercepts,
      depending on whether its graph crosses, touches, or does
      not meet the x-axis.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      4. Factoring and the quadratic formula
    </h3>

    <p>
      To solve a quadratic equation, set it equal to zero.
      Factoring is often the fastest method when possible.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg my-3">
      <p class="font-bold mb-2">Quadratic formula</p>
      <div class="font-mono text-center text-base">
        x = (−b ± √(b² − 4ac)) / (2a)
      </div>
    </div>

    <p>
      The discriminant b² − 4ac determines the number of real roots:
    </p>

    <ul class="list-disc pl-5 mb-3">
      <li>Positive: two distinct real roots.</li>
      <li>Zero: one repeated real root.</li>
      <li>Negative: no real roots.</li>
    </ul>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      5. Exponential functions
    </h3>

    <p>
      An exponential function has the variable in the exponent:
    </p>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg text-center font-bold my-3">
      f(x) = a · bˣ
    </div>

    <ul class="list-disc pl-5 mb-3">
      <li>If b &gt; 1, the function shows exponential growth.</li>
      <li>If 0 &lt; b &lt; 1, it shows exponential decay.</li>
      <li>a is the initial value because f(0) = a.</li>
    </ul>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      f(x) = 100(2)ˣ<br/>
      f(0) = 100<br/>
      f(3) = 800
    </div>

    <p>
      In growth and decay problems, identify the starting amount
      and the multiplier applied during each equal time interval.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      6. Square root and rational functions
    </h3>

    <p>
      Square root and rational functions have important restrictions.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg my-3">
      <div class="font-mono text-center">
        f(x) = √(x − 2)
      </div>
      <p class="mt-2">
        The expression inside the square root must be nonnegative:
      </p>
      <div class="font-mono text-center my-2">
        x − 2 ≥ 0 → x ≥ 2
      </div>
      <div class="font-mono text-center mt-3">
        g(x) = 1/(x − 4)
      </div>
      <p class="mt-2">
        The denominator cannot equal zero, so x ≠ 4.
      </p>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      7. Domain and range
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li>
        <b>Domain:</b> all allowed input values (x-values).
      </li>
      <li>
        <b>Range:</b> all possible output values (y-values).
      </li>
    </ul>

    <p>Remember these restrictions:</p>

    <ul class="list-disc pl-5 mb-3">
      <li>For real square roots, the radicand must be ≥ 0.</li>
      <li>A denominator must not equal zero.</li>
      <li>For f(x) = x², the domain is all real numbers and the range is y ≥ 0.</li>
    </ul>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      8. Transformations of functions
    </h3>

    <p>
      Changes to a function's formula shift, stretch, compress,
      or reflect its graph.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg my-3">
      <div class="font-mono text-center">
        f(x) + k → shift up k<br/>
        f(x) − k → shift down k<br/>
        f(x − h) → shift right h<br/>
        f(x + h) → shift left h
      </div>
    </div>

    <p>
      Multiplying f(x) by a negative number reflects the graph
      across the x-axis. Replacing x with −x reflects it across
      the y-axis.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      9. Interpreting function notation
    </h3>

    <p>
      f(x) represents the output of a function for the input x.
      To find f(a), substitute a everywhere x appears.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      f(x) = x² − 3x + 4<br/>
      f(2) = 2² − 3(2) + 4<br/>
      <b>f(2) = 2</b>
    </div>

    <p>
      On the SAT, pay attention to expressions such as f(x + 1),
      f(2x), and f(x) = 0. Substitute carefully and follow
      the exact input requested.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      10. Common SAT mistakes
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li>Confusing the vertex with an x-intercept.</li>
      <li>Forgetting that f(0) gives the y-intercept.</li>
      <li>Assuming every quadratic has two distinct real roots.</li>
      <li>Ignoring domain restrictions.</li>
      <li>Confusing exponential growth with linear growth.</li>
      <li>Misreading horizontal shifts in function notation.</li>
    </ul>

    <p class="italic opacity-80 mt-3 bg-white/50 p-2 border-l-4 border-[#1f9d8a]">
      SAT tip: Focus on recognizing function types, finding zeros
      and vertices, interpreting graphs, evaluating function notation,
      and understanding domain, range, and exponential growth or decay.
    </p>

  </div>
`
THEORY[6] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">

    <h3 class="text-[#1f9d8a] font-bold text-lg mb-2">
      1. What are nonlinear equations?
    </h3>

    <p>
      A nonlinear equation in one variable contains a variable raised
      to a power other than 1, a variable inside a radical, or a
      variable in a denominator. Its solutions are values that make
      the equation true.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      x² − 9 = 0<br/>
      √(x + 1) = 3<br/>
      1/x = 4
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      2. Solving quadratic equations
    </h3>

    <p>
      A quadratic equation has the form ax² + bx + c = 0,
      where a ≠ 0. First, move all terms to one side.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      x² − 5x + 6 = 0<br/>
      (x − 2)(x − 3) = 0<br/>
      <b>x = 2 or x = 3</b>
    </div>

    <p>
      Use the zero-product property: if AB = 0, then A = 0
      or B = 0. Set each factor equal to zero.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      3. The quadratic formula
    </h3>

    <p>
      If factoring is difficult, use the quadratic formula:
    </p>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg text-center font-bold my-3">
      x = (−b ± √(b² − 4ac)) / (2a)
    </div>

    <p>
      The discriminant b² − 4ac tells you how many real solutions exist:
    </p>

    <ul class="list-disc pl-5 mb-3">
      <li>Positive: two distinct real solutions.</li>
      <li>Zero: one repeated real solution.</li>
      <li>Negative: no real solutions.</li>
    </ul>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      4. Square root method
    </h3>

    <p>
      If an equation contains a squared expression, isolate it
      and take the square root of both sides. Remember both signs.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      (x − 2)² = 16<br/>
      x − 2 = ±4<br/>
      <b>x = 6 or x = −2</b>
    </div>

    <p>
      Common mistake: writing only the positive square root.
      For x² = 25, both x = 5 and x = −5 are solutions.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      5. Equations with radicals
    </h3>

    <p>
      Isolate the radical, then square both sides. Squaring may
      introduce extraneous solutions, so always check your answers
      in the original equation.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      √(x + 1) = 3<br/>
      x + 1 = 9<br/>
      <b>x = 8</b>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      6. Rational equations
    </h3>

    <p>
      When a variable appears in a denominator, first identify
      values that make any denominator zero. Multiply by the
      least common denominator to clear fractions, then solve.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      1/x = 1/3<br/>
      <b>x = 3, where x ≠ 0</b>
    </div>

    <p>
      Never accept a solution that makes an original denominator zero.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      7. Equations with a common factor
    </h3>

    <p>
      If every term contains the same variable factor, factor it out
      and use the zero-product property.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      x² + 4x = 0<br/>
      x(x + 4) = 0<br/>
      <b>x = 0 or x = −4</b>
    </div>

    <p>
      Do not divide by a variable expression before checking whether
      it could equal zero, or you may lose a valid solution.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      8. Word problems and applications
    </h3>

    <p>
      Nonlinear equations often model area, dimensions, and other
      relationships involving squares or products.
    </p>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg my-3">
      <p class="font-bold mb-2">Example: Rectangle</p>
      <p>
        A rectangle has width x and length x + 3.
        Its area is 40 square units. Find its dimensions.
      </p>
      <div class="font-mono text-center my-3">
        x(x + 3) = 40<br/>
        x² + 3x − 40 = 0<br/>
        (x + 8)(x − 5) = 0<br/>
        x = −8 or x = 5
      </div>
      <p class="font-bold text-[#1f9d8a]">
        Width = 5, length = 8.
      </p>
      <p class="mt-1">
        Reject x = −8 because a length must be positive.
      </p>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      9. Common SAT mistakes
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li>Forgetting to set the equation equal to zero before factoring.</li>
      <li>Missing the negative square root.</li>
      <li>Dividing by an expression that could be zero.</li>
      <li>Accepting extraneous solutions after squaring.</li>
      <li>Ignoring restrictions on denominators.</li>
      <li>Keeping negative or impossible values in real-world problems.</li>
    </ul>

    <p class="italic opacity-80 mt-3 bg-white/50 p-2 border-l-4 border-[#1f9d8a]">
      SAT tip: Factor when possible, use the quadratic formula when
      necessary, remember ± when taking square roots, and always
      check solutions in the original equation.
    </p>

  </div>
`
THEORY[7] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">

    <h3 class="text-[#1f9d8a] font-bold text-lg mb-2">
      1. What is a system of equations?
    </h3>

    <p>
      A system of equations consists of two or more equations
      with the same variables. A solution is an ordered pair (x, y)
      that makes <b>all equations true simultaneously.</b>
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      y = x + 2<br/>
      y = 2x − 1<br/>
      <b class="text-[#1f9d8a]">Solution: (3, 5)</b>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      2. Solving by substitution
    </h3>

    <p>
      If one equation is solved for a variable, substitute that
      expression into the other equation.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      y = x + 1<br/>
      x + y = 7<br/>
      x + (x + 1) = 7<br/>
      2x = 6 → x = 3<br/>
      y = 4<br/>
      <b class="text-[#1f9d8a]">Solution: (3, 4)</b>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      3. Solving by elimination
    </h3>

    <p>
      Add or subtract equations to eliminate one variable.
      If coefficients do not match, multiply one or both equations
      by suitable constants first.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      2x + y = 11<br/>
      x − y = 1<br/>
      3x = 12 → x = 4<br/>
      y = 3<br/>
      <b class="text-[#1f9d8a]">Solution: (4, 3)</b>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      4. Number of solutions
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li>
        <b>One solution:</b> the graphs intersect at one point.
      </li>
      <li>
        <b>No solution:</b> parallel lines never intersect.
      </li>
      <li>
        <b>Infinitely many solutions:</b> both equations represent
        the same line.
      </li>
    </ul>

    <div class="bg-[#fdf3f2] border border-[#fadbd8] p-3 rounded-lg my-3">
      <p class="font-bold text-[#c0392b] mb-2">
        Example: No solution
      </p>
      <div class="font-mono text-center">
        y = 2x + 3<br/>
        y = 2x − 1
      </div>
      <p class="mt-2">
        Same slope, different y-intercepts → no solution.
      </p>
    </div>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg my-3">
      <p class="font-bold mb-2">Example: Infinitely many solutions</p>
      <div class="font-mono text-center">
        x + y = 5<br/>
        2x + 2y = 10
      </div>
      <p class="mt-2">
        The second equation is twice the first, so they describe
        the same line.
      </p>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      5. Systems with nonlinear equations
    </h3>

    <p>
      A system can contain a linear equation and a nonlinear equation,
      such as a parabola and a line. Use substitution to find their
      intersection points.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      y = x²<br/>
      y = x + 2<br/>
      x² = x + 2<br/>
      x² − x − 2 = 0<br/>
      (x − 2)(x + 1) = 0<br/>
      <b>x = 2 or x = −1</b>
    </div>

    <p>
      Find y for each x:
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      x = 2 → y = 4<br/>
      x = −1 → y = 1<br/>
      <b class="text-[#1f9d8a]">Solutions: (2, 4), (−1, 1)</b>
    </div>

    <p>
      A line and a parabola can intersect at zero, one, or two points.
      Other nonlinear systems may have different numbers of solutions.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      6. Graphical interpretation
    </h3>

    <p>
      The solutions of a system are the points where the graphs
      intersect. For nonlinear systems, there may be multiple
      intersection points.
    </p>

    <ul class="list-disc pl-5 mb-3">
      <li>Two intersection points → two solutions.</li>
      <li>One intersection point → one solution.</li>
      <li>No intersection → no real solutions.</li>
    </ul>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      7. Word problems
    </h3>

    <p>
      Define two variables and translate the information into
      two equations. Common SAT contexts include prices, tickets,
      ages, distances, and numbers.
    </p>

    <div class="bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg my-3">
      <p class="font-bold mb-2">Example: Tickets</p>
      <p>
        Adult tickets cost $10 and student tickets cost $5.
        A total of 8 tickets cost $55. How many adult tickets
        were purchased?
      </p>
      <div class="font-mono text-center my-3">
        x + y = 8<br/>
        10x + 5y = 55<br/>
        2x + y = 11<br/>
        x = 3, y = 5
      </div>
      <p class="font-bold text-[#1f9d8a]">
        Answer: 3 adult tickets.
      </p>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      8. Systems with parameters
    </h3>

    <p>
      If an equation contains a constant such as k, compare the
      equations to determine the number of solutions or find the
      value of the parameter.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      y = 3x + 4<br/>
      y = 3x + k
    </div>

    <ul class="list-disc pl-5 mb-3">
      <li>k = 4 → infinitely many solutions.</li>
      <li>k ≠ 4 → no solution.</li>
    </ul>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      9. Common SAT mistakes
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li>Finding x but forgetting to calculate y.</li>
      <li>Making sign errors when adding or subtracting equations.</li>
      <li>Assuming every system has exactly one solution.</li>
      <li>Forgetting that nonlinear systems can have multiple solutions.</li>
      <li>Accepting a point that satisfies only one equation.</li>
      <li>Ignoring restrictions in word problems.</li>
    </ul>

    <p class="italic opacity-80 mt-3 bg-white/50 p-2 border-l-4 border-[#1f9d8a]">
      SAT tip: Use substitution when a variable is isolated,
      elimination when coefficients can cancel, and graph
      intersections to interpret the number of solutions.
      Always verify the ordered pair in every original equation.
    </p>

  </div>
`
THEORY[8] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">

    <h3 class="text-[#1f9d8a] font-bold text-lg mb-2">
      1. What are equivalent expressions?
    </h3>

    <p>
      Equivalent expressions look different but have the same value
      for every allowed value of the variable. You can simplify
      expressions by expanding, factoring, or combining like terms.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      3(x + 2) = 3x + 6<br/>
      x + x + x = 3x<br/>
      <b class="text-[#1f9d8a]">(x + 2)(x + 3) = x² + 5x + 6</b>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      2. Combining like terms
    </h3>

    <p>
      Like terms have the same variables raised to the same powers.
      Combine their coefficients, but do not combine unlike terms.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      4x + 3x − 2 + 5 = 7x + 3<br/>
      3x² + 2x − x² + 4x = 2x² + 6x
    </div>

    <p>
      Remember: x² and x are not like terms, so they cannot be
      combined into a single term.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      3. Distributive property
    </h3>

    <p>
      Multiply the factor outside parentheses by every term inside.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      a(b + c) = ab + ac<br/>
      3(2x − 4) = 6x − 12<br/>
      −2(x − 5) = −2x + 10
    </div>

    <p class="bg-white/50 border-l-4 border-[#1f9d8a] p-2">
      <b>SAT trap:</b> A negative factor changes the sign of every
      term inside the parentheses.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      4. Factoring expressions
    </h3>

    <p>
      Factoring reverses distribution. Find a common factor or
      recognize a special algebraic pattern.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-mono my-3">
      6x + 12 = 6(x + 2)<br/>
      x² + 5x + 6 = (x + 2)(x + 3)<br/>
      x² − 9 = (x − 3)(x + 3)
    </div>

    <p class="font-bold mt-2">Important identities:</p>

    <div class="font-mono text-center bg-[#eaf7f5] border border-[#bce8df] p-3 rounded-lg my-3">
      a² − b² = (a − b)(a + b)<br/>
      (a + b)² = a² + 2ab + b²<br/>
      (a − b)² = a² − 2ab + b²
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      5. Laws of exponents
    </h3>

    <p>For nonzero bases where required, use these rules:</p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      xᵃ · xᵇ = xᵃ⁺ᵇ<br/>
      xᵃ / xᵇ = xᵃ⁻ᵇ<br/>
      (xᵃ)ᵇ = xᵃᵇ<br/>
      (xy)ᵃ = xᵃyᵃ<br/>
      x⁰ = 1, x ≠ 0<br/>
      x⁻ᵃ = 1/xᵃ
    </div>

    <p>
      When multiplying powers with the same base, add exponents.
      When dividing, subtract exponents. When raising a power
      to another power, multiply exponents.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      6. Equivalent rational expressions
    </h3>

    <p>
      You can simplify fractions by factoring and canceling common
      factors. Cancel factors, not individual terms.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      (x² − 9)/(x − 3)<br/>
      = ((x − 3)(x + 3))/(x − 3)<br/>
      = x + 3, where x ≠ 3
    </div>

    <p>
      The original expression is undefined at x = 3, even though
      the simplified expression x + 3 is defined there.
      Equivalent expressions must respect the original domain.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      7. Fractions and radicals
    </h3>

    <p>Useful rules for simplifying expressions:</p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      a/b + c/b = (a + c)/b<br/>
      √a · √b = √(ab)<br/>
      √(a²) = |a|
    </div>

    <p>
      For real square roots, the radicands must be nonnegative.
      Be careful: √(x²) equals |x|, not always x.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      8. Rewriting expressions in different forms
    </h3>

    <p>
      SAT questions may ask you to rewrite an expression to reveal
      a particular property, such as a maximum, minimum, or root.
    </p>

    <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg my-3">
      <p class="font-bold mb-2">Example: Completing the square</p>
      <div class="font-mono text-center">
        x² + 6x + 5<br/>
        = (x + 3)² − 4
      </div>
      <p class="mt-2">
        This form makes the vertex of the corresponding parabola
        easy to identify: (−3, −4).
      </p>
    </div>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      9. Evaluating equivalent expressions
    </h3>

    <p>
      If two expressions are equivalent, substituting the same
      allowed value into both gives the same result.
    </p>

    <div class="font-mono text-center bg-gray-50 p-3 rounded-lg my-3">
      2(x + 4) + 3x<br/>
      = 2x + 8 + 3x<br/>
      = 5x + 8
    </div>

    <p>
      For x = 2, both expressions equal 18. Testing values can help
      check an answer, but a general algebraic simplification
      establishes equivalence for all allowed values.
    </p>

    <h3 class="text-[#1f9d8a] font-bold text-lg mt-6 mb-2">
      10. Common SAT mistakes
    </h3>

    <ul class="list-disc pl-5 mb-3">
      <li>Combining unlike terms, such as x and x².</li>
      <li>Forgetting negative signs when expanding parentheses.</li>
      <li>Using incorrect exponent rules.</li>
      <li>Canceling terms instead of common factors.</li>
      <li>Forgetting restrictions on denominators.</li>
      <li>Assuming √(x²) always equals x.</li>
      <li>Expanding when factoring would be faster.</li>
    </ul>

    <p class="italic opacity-80 mt-3 bg-white/50 p-2 border-l-4 border-[#1f9d8a]">
      SAT tip: Choose the form that makes the question easiest.
      Expand to combine terms, factor to reveal roots, use exponent
      rules to simplify powers, and always check restrictions when
      working with fractions or radicals.
    </p>

  </div>
`
THEORY[9] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Ratios, Rates, and Units
    </h2>

    <p class="mb-3">
      On the SAT, ratios, rates, and units are used to compare quantities,
      solve real-world problems, and convert measurements. Questions may
      involve recipes, speed, prices, distances, time, and proportional
      relationships.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Ratios
    </h3>
    <p class="mb-2">
      A <b>ratio</b> compares two quantities by division. If there are 3 red
      balls and 5 blue balls, the ratio of red balls to blue balls is
      <b> 3:5</b> or <b>3/5</b>.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Important ratio rules</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Order matters: the ratio of A to B is A/B.</li>
        <li>Equivalent ratios are made by multiplying or dividing both parts by the same nonzero number.</li>
        <li>A ratio of 3:5 does not mean that 3 out of 5 objects are red; it means 3 red for every 5 blue.</li>
        <li>If a ratio is 3:5, the total number of parts is 3 + 5 = 8.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 1</p>
      <p>
        The ratio of boys to girls in a class is 2:3. There are 25 students.
        How many are girls?
      </p>
      <p class="mt-2">
        Total parts = 2 + 3 = 5
      </p>
      <p>
        Each part = 25 / 5 = 5
      </p>
      <p>
        Girls = 3 × 5 = <b>15</b>
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Finding an Unknown Quantity from a Ratio
    </h3>
    <p class="mb-2">
      If two quantities are in the ratio a:b, they can be represented as
      <b> ax</b> and <b> bx</b>, where x is a common multiplier.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 2</p>
      <p>
        Two numbers are in the ratio 4:7. Their sum is 44. Find the larger
        number.
      </p>
      <p class="mt-2">Let the numbers be 4x and 7x.</p>
      <p>4x + 7x = 44</p>
      <p>11x = 44, so x = 4</p>
      <p>The larger number is 7 × 4 = <b>28</b>.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Rates and Unit Rates
    </h3>
    <p class="mb-2">
      A <b>rate</b> compares quantities with different units. A <b>unit
      rate</b> gives the amount per one unit of another quantity.
    </p>
    <ul class="list-disc pl-5 space-y-1 mb-3">
      <li>Speed: miles per hour (mi/h)</li>
      <li>Price: dollars per item ($/item)</li>
      <li>Work rate: pages per minute (pages/min)</li>
      <li>Flow rate: gallons per minute (gal/min)</li>
    </ul>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Unit rate formula</p>
      <p class="text-center font-semibold">
        Unit rate = quantity ÷ number of units
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 3</p>
      <p>
        A car travels 180 miles in 3 hours. What is its average speed?
      </p>
      <p class="mt-2">
        Speed = distance / time = 180 / 3 = <b>60 miles per hour</b>.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Proportional Relationships
    </h3>
    <p class="mb-2">
      Two quantities are directly proportional if their ratio remains
      constant. The relationship can be written as:
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">y = kx</p>
      <p class="mt-1">
        Here, <b>k</b> is the constant of proportionality.
      </p>
    </div>

    <p class="mb-2">
      If x doubles, y doubles. If x triples, y triples. The ratio y/x remains
      constant, and the graph of y = kx is a straight line through the origin.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 4</p>
      <p>
        Five notebooks cost $15. Assuming the price per notebook is constant,
        how much do 8 notebooks cost?
      </p>
      <p class="mt-2">Unit price = 15 / 5 = $3</p>
      <p>Total cost = 8 × 3 = <b>$24</b>.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      5. Solving Proportions
    </h3>
    <p class="mb-2">
      A proportion states that two ratios are equal. If
      a/b = c/d, where b and d are nonzero, then cross multiplication gives
      <b> ad = bc</b>.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 5</p>
      <p>Solve for x: 3/5 = x/20</p>
      <p class="mt-2">5x = 3 × 20</p>
      <p>5x = 60</p>
      <p><b>x = 12</b></p>
    </div>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-1">SAT trap</p>
      <p>
        Always match corresponding quantities in the same order. If a recipe
        uses 2 cups of flour for 3 cups of milk, use flour/milk = 2/3, not
        3/2, unless the question asks for milk per cup of flour.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      6. Unit Conversions
    </h3>
    <p class="mb-2">
      To convert measurements, multiply by a conversion factor equal to 1.
      Choose the factor so that the original unit cancels and the desired
      unit remains.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Common conversions</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>1 foot = 12 inches</li>
        <li>1 yard = 3 feet</li>
        <li>1 mile = 5,280 feet</li>
        <li>1 hour = 60 minutes</li>
        <li>1 minute = 60 seconds</li>
        <li>1 kilogram = 1,000 grams</li>
        <li>1 liter = 1,000 milliliters</li>
      </ul>
      <p class="mt-2 text-xs">
        Use any conversion factors provided in the question, especially for
        less familiar units.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 6</p>
      <p>Convert 2.5 hours to minutes.</p>
      <p class="mt-2">2.5 × 60 = <b>150 minutes</b>.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      7. Compound Units
    </h3>
    <p class="mb-2">
      Compound units combine two or more units, such as miles per hour,
      dollars per kilogram, or square meters. Pay attention to whether the
      units are multiplied or divided.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 7</p>
      <p>
        A printer produces 240 pages in 8 minutes. At the same constant rate,
        how many pages will it produce in 15 minutes?
      </p>
      <p class="mt-2">Rate = 240 / 8 = 30 pages per minute</p>
      <p>Pages = 30 × 15 = <b>450</b>.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      8. Speed, Distance, and Time
    </h3>
    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">Distance = Speed × Time</p>
      <p class="text-center font-semibold">Speed = Distance / Time</p>
      <p class="text-center font-semibold">Time = Distance / Speed</p>
    </div>

    <p class="mb-2">
      The units must be compatible. For example, if speed is measured in
      miles per hour, time should be measured in hours to obtain distance in
      miles.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 8</p>
      <p>
        A cyclist travels at 12 miles per hour for 45 minutes. How far does
        the cyclist travel?
      </p>
      <p class="mt-2">45 minutes = 45/60 = 0.75 hours</p>
      <p>Distance = 12 × 0.75 = <b>9 miles</b>.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      9. Ratios with Percentages
    </h3>
    <p class="mb-2">
      A percentage is a ratio with a denominator of 100. To convert a
      percentage to a decimal, divide by 100. To convert a decimal to a
      percentage, multiply by 100%.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 9</p>
      <p>
        A class has 40 students, and 30% are in the chess club. How many
        students are in the chess club?
      </p>
      <p class="mt-2">30% × 40 = 0.30 × 40 = <b>12 students</b>.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      10. Dimensional Analysis
    </h3>
    <p class="mb-2">
      Dimensional analysis uses units to check whether a calculation makes
      sense. Units behave algebraically: they can cancel in division and
      combine in multiplication.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 10</p>
      <p>
        A machine fills 4 bottles per minute. How many bottles can it fill
        in 25 minutes?
      </p>
      <p class="mt-2">
        4 bottles/minute × 25 minutes = <b>100 bottles</b>.
      </p>
      <p class="mt-1">
        The minutes cancel, leaving bottles.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      11. Common SAT Mistakes
    </h3>
    <ul class="list-disc pl-5 space-y-1 mb-3">
      <li>Reversing the order of a ratio or rate.</li>
      <li>Adding ratio parts incorrectly when finding a total.</li>
      <li>Comparing quantities with different units without converting them.</li>
      <li>Using minutes with a speed measured per hour without converting.</li>
      <li>Assuming a relationship is proportional when the problem does not support that assumption.</li>
      <li>Forgetting that a unit rate is measured per one unit.</li>
      <li>Mixing up total quantity and quantity per unit.</li>
    </ul>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">SAT Strategy</p>
      <p>
        Before calculating, write down the units for every quantity. Identify
        what the question asks for, convert units if necessary, and choose a
        ratio or rate with the correct order. If two quantities are directly
        proportional, use a constant of proportionality or a proportion to
        solve efficiently.
      </p>
    </div>

    <p class="italic text-[#1f9d8a] mt-4">
      SAT Tip: Track the units as carefully as the numbers. A correct
      calculation with the wrong units or reversed ratio can still produce
      the wrong answer.
    </p>
  </div>
`
THEORY[10] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Percentages
    </h2>

    <p class="mb-3">
      Percentages represent parts out of 100. On the SAT, percentage problems
      often involve finding a percent of a number, calculating percent
      increase or decrease, discounts, and reversing percentage changes.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Basic Percentage Formula
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Key formulas</p>
      <p class="text-center font-semibold">
        Part = Percent × Whole
      </p>
      <p class="text-center font-semibold">
        Percent = (Part / Whole) × 100%
      </p>
      <p class="text-center font-semibold">
        Whole = Part / Percent
      </p>
      <p class="text-xs mt-2">
        Convert percentages to decimals before multiplying or dividing:
        25% = 0.25, 8% = 0.08, and 150% = 1.5.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 1</p>
      <p>What is 30% of 80?</p>
      <p class="mt-2">0.30 × 80 = <b>24</b></p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Percent Increase and Decrease
    </h3>

    <p class="mb-2">
      To calculate a percent change, divide the change by the original value
      and multiply by 100%.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">
        Percent change = (Change / Original value) × 100%
      </p>
      <p class="mt-2">
        Percent increase uses a positive change; percent decrease uses the
        amount that was lost or reduced.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 2</p>
      <p>A price increases from $40 to $50. What is the percent increase?</p>
      <p class="mt-2">Change = 50 − 40 = 10</p>
      <p>Percent increase = (10 / 40) × 100% = <b>25%</b></p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Finding the New Value
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-semibold">After an increase of r%:</p>
      <p class="text-center">New value = Original × (1 + r/100)</p>
      <p class="font-semibold mt-2">After a decrease of r%:</p>
      <p class="text-center">New value = Original × (1 − r/100)</p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 3</p>
      <p>A $120 jacket is discounted by 15%. What is the sale price?</p>
      <p class="mt-2">Discount = 120 × 0.15 = $18</p>
      <p>Sale price = 120 − 18 = <b>$102</b></p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Reverse Percentage Problems
    </h3>

    <p class="mb-2">
      If the final value is known, divide by the percentage multiplier to
      find the original value.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 4</p>
      <p>
        After a 20% discount, a product costs $64. What was its original price?
      </p>
      <p class="mt-2">
        A 20% discount means the final price is 80% of the original.
      </p>
      <p>Original price = 64 / 0.80 = <b>$80</b></p>
    </div>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-1">SAT Trap: Successive Changes</p>
      <p>
        Two percentage changes are usually applied one after another, not
        added together. For example, a 20% increase followed by a 20% decrease
        does not return to the original value.
      </p>
      <p class="mt-2">
        If the original value is 100: 100 × 1.20 × 0.80 = 96. The final value
        is 4% lower than the original.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      5. Common SAT Mistakes
    </h3>

    <ul class="list-disc pl-5 space-y-1 mb-3">
      <li>Using the new value instead of the original value when calculating percent change.</li>
      <li>Forgetting to convert a percentage into a decimal.</li>
      <li>Adding successive percentage changes instead of multiplying their factors.</li>
      <li>Confusing the amount of change with the final value.</li>
      <li>Assuming a 50% increase followed by a 50% decrease returns to the original value.</li>
    </ul>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">SAT Strategy</p>
      <p>
        Identify the original value first. Decide whether the question asks
        for a part, a percent, a change, or the original amount. For repeated
        changes, use multipliers such as 1.15 for a 15% increase and 0.85
        for a 15% decrease.
      </p>
    </div>

    <p class="italic text-[#1f9d8a] mt-4">
      SAT Tip: A percentage change is always calculated relative to the
      original value of that change. Read carefully to identify which value
      is the original.
    </p>
  </div>
`
THEORY[11] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      One-Variable Data
    </h2>

    <p class="mb-3">
      On the SAT, one-variable data questions focus on analyzing a single
      set of numerical values. You should understand measures of center,
      measures of spread, and how changes in a data set affect its statistics.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Mean, Median, and Mode
    </h3>

    <ul class="list-disc pl-5 space-y-2 mb-3">
      <li>
        <b>Mean:</b> The sum of all values divided by the number of values.
        <div class="text-center font-semibold mt-1">
          Mean = Sum of values / Number of values
        </div>
      </li>
      <li>
        <b>Median:</b> The middle value after arranging the data in order.
        If there are an even number of values, average the two middle values.
      </li>
      <li>
        <b>Mode:</b> The value that appears most often. A data set may have
        more than one mode or no mode.
      </li>
    </ul>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 1</p>
      <p>Find the mean, median, and mode of 2, 3, 3, 6, 11.</p>
      <p class="mt-2">Mean = 25 / 5 = <b>5</b></p>
      <p>Median = <b>3</b></p>
      <p>Mode = <b>3</b></p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Range and Interquartile Range
    </h3>

    <ul class="list-disc pl-5 space-y-1 mb-3">
      <li>
        <b>Range:</b> Maximum value − Minimum value.
      </li>
      <li>
        <b>First quartile (Q1):</b> The median of the lower half of the
        ordered data.
      </li>
      <li>
        <b>Third quartile (Q3):</b> The median of the upper half of the
        ordered data.
      </li>
      <li>
        <b>Interquartile range (IQR):</b> Q3 − Q1. It describes the spread
        of the middle 50% of the data.
      </li>
    </ul>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 2</p>
      <p>For the data set 1, 3, 5, 7, 9, find the range.</p>
      <p class="mt-2">Range = 9 − 1 = <b>8</b></p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Effects of Adding or Changing Values
    </h3>

    <p class="mb-2">
      Adding the same number to every data value increases the mean and
      median by that number but does not change the range or IQR.
      Multiplying every value by a positive constant multiplies the mean,
      median, range, and IQR by that constant.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Important SAT facts</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Adding a value far above the others usually increases the mean.</li>
        <li>The median is less affected by extreme values than the mean.</li>
        <li>Changing the largest value may change the range but not necessarily the median.</li>
        <li>Adding the same constant to every value does not change the range.</li>
      </ul>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Reading Data Displays
    </h3>

    <p class="mb-2">
      SAT questions may present data in tables, dot plots, histograms,
      or box plots. Read the scale carefully and identify what each value
      or interval represents.
    </p>

    <ul class="list-disc pl-5 space-y-1 mb-3">
      <li>
        <b>Dot plot:</b> Each dot represents a data value; repeated dots
        show frequency.
      </li>
      <li>
        <b>Histogram:</b> Bars represent the frequency of values within
        intervals.
      </li>
      <li>
        <b>Box plot:</b> Shows the minimum, Q1, median, Q3, and maximum.
      </li>
      <li>
        <b>Frequency table:</b> Shows how often each value or category occurs.
      </li>
    </ul>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-1">SAT Trap</p>
      <p>
        The mean is not always one of the values in the data set. Also,
        when finding the median, always arrange the values in numerical
        order first.
      </p>
    </div>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">SAT Strategy</p>
      <p>
        Identify whether the question asks about center (mean, median, mode)
        or spread (range, IQR). For data displays, check the axes, scale,
        frequencies, and units before calculating.
      </p>
    </div>

    <p class="italic text-[#1f9d8a] mt-4">
      SAT Tip: Extreme values can strongly affect the mean and range, but
      the median and IQR are often more resistant to outliers.
    </p>
  </div>
`
THEORY[12] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Two-Variable Data & Scatterplots
    </h2>

    <p class="mb-3">
      Two-variable data involves studying the relationship between two
      variables. On the SAT, you may need to interpret scatterplots, identify
      associations, understand lines of best fit, and use a model to make
      predictions.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Scatterplots
    </h3>

    <p class="mb-2">
      A scatterplot displays paired data as points on a coordinate plane.
      Each point represents an ordered pair (x, y), where x is one variable
      and y is the other.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Types of association</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><b>Positive association:</b> As x increases, y tends to increase.</li>
        <li><b>Negative association:</b> As x increases, y tends to decrease.</li>
        <li><b>No association:</b> There is no clear relationship between the variables.</li>
        <li><b>Strong association:</b> Points lie close to a clear pattern.</li>
        <li><b>Weak association:</b> Points are more widely scattered around the pattern.</li>
      </ul>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Linear and Nonlinear Relationships
    </h3>

    <p class="mb-2">
      A linear relationship follows an approximately straight-line pattern.
      A nonlinear relationship follows a curve or another pattern that is
      not well represented by a straight line.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 1</p>
      <p>
        A scatterplot shows that students who study more hours tend to earn
        higher test scores. What type of association is present?
      </p>
      <p class="mt-2">
        As study time increases, test scores tend to increase. This is a
        <b> positive association</b>.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Lines of Best Fit
    </h3>

    <p class="mb-2">
      A line of best fit models the overall trend in a scatterplot. It
      generally passes through the center of the data, with points distributed
      around it.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Linear model</p>
      <p class="text-center font-semibold">y = mx + b</p>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li><b>m:</b> slope, the predicted change in y for each 1-unit increase in x.</li>
        <li><b>b:</b> y-intercept, the predicted value of y when x = 0.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 2</p>
      <p>
        A line of best fit is y = 4x + 10, where x is the number of hours
        studied and y is a predicted test score.
      </p>
      <p class="mt-2">
        For x = 5: y = 4(5) + 10 = <b>30</b>.
      </p>
      <p>The model predicts a score of 30.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Interpreting Slope and Intercept
    </h3>

    <p class="mb-2">
      Always interpret the slope and intercept in the context of the problem
      and include the appropriate units.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 3</p>
      <p>
        A model estimates the cost of a taxi ride using y = 2.5x + 4, where
        x is the distance in miles and y is the cost in dollars.
      </p>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li>The slope 2.5 means the cost increases by $2.50 per mile.</li>
        <li>The intercept 4 represents the initial cost of $4.</li>
      </ul>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      5. Correlation Does Not Mean Causation
    </h3>

    <p class="mb-2">
      An association between two variables does not prove that one variable
      causes the other. Both variables may be affected by another factor,
      or the relationship may be coincidental.
    </p>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-1">SAT Trap</p>
      <p>
        A line of best fit provides estimates, not guaranteed exact values.
        Be cautious about predictions far outside the observed data range;
        this is called extrapolation.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      6. Residuals
    </h3>

    <p class="mb-2">
      A residual is the difference between an observed y-value and the
      y-value predicted by the model.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">
        Residual = Observed value − Predicted value
      </p>
      <p class="mt-2">
        A positive residual means the observed value is above the predicted
        value. A negative residual means it is below the predicted value.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 4</p>
      <p>
        A model predicts a value of 72, but the actual value is 80.
      </p>
      <p class="mt-2">Residual = 80 − 72 = <b>8</b>.</p>
    </div>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">SAT Strategy</p>
      <p>
        First identify the direction and strength of the association. If a
        line of best fit is provided, use its equation to predict values,
        interpret the slope and intercept with units, and distinguish
        observed values from predicted values.
      </p>
    </div>

    <p class="italic text-[#1f9d8a] mt-4">
      SAT Tip: Always interpret a graph in context. A positive association
      describes a trend, not necessarily a cause-and-effect relationship.
    </p>
  </div>
`
THEORY[13] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Probability
    </h2>

    <p class="mb-3">
      Probability measures how likely an event is to occur. On the SAT,
      questions may involve simple probability, complementary events,
      compound events, and interpreting probabilities from tables or data.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Basic Probability
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">
        P(event) = Favorable outcomes / Total equally likely outcomes
      </p>
      <p class="mt-2">
        Probability ranges from 0 to 1, or from 0% to 100%.
      </p>
      <ul class="list-disc pl-5 mt-1 space-y-1">
        <li>0 means impossible.</li>
        <li>1 means certain.</li>
        <li>A probability of 0.5 means a 50% chance.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 1</p>
      <p>
        A bag contains 4 red balls and 6 blue balls. If one ball is chosen
        at random, what is the probability of choosing a red ball?
      </p>
      <p class="mt-2">
        Total balls = 4 + 6 = 10
      </p>
      <p>
        P(red) = 4/10 = <b>2/5</b>
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Complementary Events
    </h3>

    <p class="mb-2">
      The complement of an event is the event that it does not occur.
      Sometimes it is easier to find the probability of the opposite event.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">
        P(not A) = 1 − P(A)
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 2</p>
      <p>
        The probability that a student passes an exam is 0.85. What is the
        probability that the student does not pass?
      </p>
      <p class="mt-2">1 − 0.85 = <b>0.15</b>, or 15%.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Independent Events
    </h3>

    <p class="mb-2">
      Two events are independent if the outcome of one does not affect the
      probability of the other. For independent events, the probability that
      both occur is found by multiplying their probabilities.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">
        P(A and B) = P(A) × P(B)
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 3</p>
      <p>
        A fair coin is flipped twice. What is the probability of getting
        heads both times?
      </p>
      <p class="mt-2">P = 1/2 × 1/2 = <b>1/4</b></p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Mutually Exclusive Events
    </h3>

    <p class="mb-2">
      Two events are mutually exclusive if they cannot occur at the same
      time. To find the probability that either event occurs, add their
      probabilities.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">
        P(A or B) = P(A) + P(B)
      </p>
      <p class="text-xs mt-2">
        This formula applies directly when A and B cannot happen together.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      5. Probability Without Replacement
    </h3>

    <p class="mb-2">
      When an item is selected and not returned, the total number of items
      changes. The probability of the next selection may also change.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 4</p>
      <p>
        A bag contains 3 green balls and 2 yellow balls. Two balls are chosen
        without replacement. What is the probability that both are green?
      </p>
      <p class="mt-2">
        P = 3/5 × 2/4 = 6/20 = <b>3/10</b>
      </p>
    </div>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-1">SAT Trap</p>
      <p>
        Do not assume events are independent when items are selected without
        replacement. Also, multiply probabilities for independent events
        that must both happen; add probabilities for mutually exclusive
        alternatives when either can happen.
      </p>
    </div>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">SAT Strategy</p>
      <p>
        Identify the total number of possible outcomes and the favorable
        outcomes. For “not” questions, use the complement. For multiple
        selections, check whether the events are independent and whether
        the items are replaced.
      </p>
    </div>

    <p class="italic text-[#1f9d8a] mt-4">
      SAT Tip: The words “and,” “or,” “at least one,” and “without replacement”
      often tell you which probability method to use.
    </p>
  </div>
`
THEORY[14] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Inference & Margin of Error
    </h2>

    <p class="mb-3">
      On the SAT, inference questions focus on using sample data to draw
      conclusions about a larger population. You should understand
      representative samples, sampling bias, and margin of error.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Population and Sample
    </h3>

    <ul class="list-disc pl-5 space-y-1 mb-3">
      <li>
        <b>Population:</b> The entire group being studied.
      </li>
      <li>
        <b>Sample:</b> A smaller group selected from the population.
      </li>
      <li>
        <b>Inference:</b> A conclusion about a population based on sample data.
      </li>
      <li>
        <b>Representative sample:</b> A sample that reflects the population's
        important characteristics.
      </li>
    </ul>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 1</p>
      <p>
        A school surveys 100 randomly selected students to estimate the
        percentage of all students who prefer online homework.
      </p>
      <p class="mt-2">
        The 100 students are the <b>sample</b>, and all students at the school
        are the <b>population</b>.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Random Sampling and Bias
    </h3>

    <p class="mb-2">
      A random sample gives members of the population a chance of being
      selected and generally supports more reliable conclusions.
      A biased sample systematically overrepresents or underrepresents
      certain groups.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Remember</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>A larger random sample generally produces more precise estimates.</li>
        <li>A large biased sample can still produce misleading results.</li>
        <li>Conclusions should apply only to the population the sample represents.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 2</p>
      <p>
        A researcher surveys people leaving a gym about how often they
        exercise. Can the researcher reliably estimate exercise habits for
        the entire city?
      </p>
      <p class="mt-2">
        Not necessarily. People leaving a gym may exercise more often than
        the general population, creating <b>sampling bias</b>.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Margin of Error
    </h3>

    <p class="mb-2">
      The margin of error describes how far an estimate may reasonably be
      from the true population value at a specified confidence level.
      A smaller margin of error means a more precise estimate.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Confidence interval</p>
      <p class="text-center font-semibold">
        Estimate ± Margin of Error
      </p>
      <p class="mt-2">
        Lower bound = Estimate − Margin of Error
      </p>
      <p>
        Upper bound = Estimate + Margin of Error
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 3</p>
      <p>
        A survey estimates that 60% of voters support a proposal, with a
        margin of error of 4 percentage points.
      </p>
      <p class="mt-2">
        Lower bound = 60% − 4% = 56%
      </p>
      <p>
        Upper bound = 60% + 4% = 64%
      </p>
      <p class="mt-2">
        The interval is <b>56% to 64%</b>.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. What Affects Margin of Error?
    </h3>

    <ul class="list-disc pl-5 space-y-1 mb-3">
      <li>
        <b>Sample size:</b> Larger samples generally have smaller margins
        of error, assuming comparable sampling methods and confidence levels.
      </li>
      <li>
        <b>Confidence level:</b> A higher confidence level generally requires
        a larger margin of error for the same data and method.
      </li>
      <li>
        <b>Sampling method:</b> Bias cannot be fixed simply by increasing
        the sample size.
      </li>
    </ul>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-1">SAT Trap</p>
      <p>
        A margin of error of 3 percentage points around an estimate of 40%
        gives an interval of 37% to 43%, not 39% to 41%.
        Also, margin of error does not account for every possible source
        of survey error, such as biased sampling or misleading questions.
      </p>
    </div>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">SAT Strategy</p>
      <p>
        Identify the population and sample first. Check whether the sample
        is random and representative. For margin-of-error questions, add
        and subtract the stated margin from the estimate, and interpret the
        result in context.
      </p>
    </div>

    <p class="italic text-[#1f9d8a] mt-4">
      SAT Tip: A bigger random sample usually improves precision, but it does
      not automatically eliminate bias or guarantee that a conclusion is correct.
    </p>
  </div>
`
THEORY[15] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Evaluating Statistical Claims
    </h2>

    <p class="mb-3">
      On the SAT, statistical claims must be evaluated using data, sample
      quality, and the methods used to collect information. You should
      recognize misleading graphs, biased samples, unsupported conclusions,
      and the difference between correlation and causation.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Check the Sample
    </h3>

    <p class="mb-2">
      Before accepting a statistical claim, ask who was surveyed, how the
      sample was selected, and whether it represents the population.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">Common sources of bias</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><b>Selection bias:</b> Some groups are more likely to be included.</li>
        <li><b>Voluntary response bias:</b> People choose whether to participate.</li>
        <li><b>Small sample:</b> Results may be less reliable or precise.</li>
        <li><b>Nonresponse bias:</b> People who do not respond may differ from those who do.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 1</p>
      <p>
        An online poll asks visitors to a gaming website whether students
        should spend more time playing video games. Can the results represent
        all students?
      </p>
      <p class="mt-2">
        Not necessarily. Visitors to a gaming website may not represent
        the overall student population.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Correlation vs. Causation
    </h3>

    <p class="mb-2">
      A correlation means two variables are associated. It does not prove
      that one variable causes the other. A third variable may influence
      both, or the association may be coincidental.
    </p>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 2</p>
      <p>
        Data show that ice cream sales and swimming accidents both increase
        during summer.
      </p>
      <p class="mt-2">
        This does not mean ice cream causes swimming accidents. Hot weather
        may increase both swimming and ice cream consumption.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Misleading Graphs and Percentages
    </h3>

    <ul class="list-disc pl-5 space-y-1 mb-3">
      <li>
        <b>Truncated axes:</b> A graph that does not start at zero can make
        small differences look much larger.
      </li>
      <li>
        <b>Unequal scales:</b> Different intervals can distort visual comparisons.
      </li>
      <li>
        <b>Missing context:</b> A graph may omit units, labels, or the time period.
      </li>
      <li>
        <b>Percent vs. percentage points:</b> An increase from 20% to 30% is
        10 percentage points, but a 50% relative increase.
      </li>
    </ul>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 3</p>
      <p>
        The percentage of students who pass an exam rises from 40% to 50%.
        What is the relative percent increase?
      </p>
      <p class="mt-2">
        Change = 50 − 40 = 10 percentage points
      </p>
      <p>
        Relative increase = (10 / 40) × 100% = <b>25%</b>
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Observational Studies vs. Experiments
    </h3>

    <ul class="list-disc pl-5 space-y-1 mb-3">
      <li>
        <b>Observational study:</b> Researchers observe existing conditions
        without assigning treatments.
      </li>
      <li>
        <b>Experiment:</b> Researchers assign treatments or conditions to
        study their effects.
      </li>
      <li>
        <b>Random assignment:</b> Helps create comparable groups and supports
        stronger conclusions about cause and effect.
      </li>
    </ul>

    <p class="mb-3">
      Even an experiment must be designed carefully. Random assignment is
      different from random sampling: random sampling helps make results
      representative of a population, while random assignment helps compare
      treatments fairly.
    </p>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-1">SAT Trap</p>
      <p>
        A claim can be mathematically correct but still misleading if the
        sample is biased, the graph uses a distorted scale, or the conclusion
        goes beyond what the data support.
      </p>
    </div>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">SAT Strategy</p>
      <p>
        Check the source, sample, graph scales, and calculation. Decide
        whether the evidence supports the exact claim or only a weaker
        conclusion. Do not confuse association with causation or percentage
        points with percent change.
      </p>
    </div>

    <p class="italic text-[#1f9d8a] mt-4">
      SAT Tip: The strongest statistical conclusion is the one supported by
      the data without making assumptions the study cannot justify.
    </p>
  </div>
`
THEORY[16] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Area and Volume
    </h2>

    <p class="mb-3">
      On the SAT, area and volume questions involve geometric formulas,
      composite figures, and changes in dimensions. Always identify the
      shape, use the correct formula, and include the appropriate units.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Area of Common Shapes
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ul class="list-disc pl-5 space-y-2">
        <li><b>Rectangle:</b> A = lw</li>
        <li><b>Square:</b> A = s²</li>
        <li><b>Triangle:</b> A = ½bh</li>
        <li><b>Parallelogram:</b> A = bh</li>
        <li><b>Trapezoid:</b> A = ½(b₁ + b₂)h</li>
        <li><b>Circle:</b> A = πr²</li>
      </ul>
      <p class="text-xs mt-2">
        Here, l = length, w = width, b = base, h = perpendicular height,
        and r = radius.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 1</p>
      <p>
        A triangle has a base of 12 cm and a perpendicular height of 7 cm.
        Find its area.
      </p>
      <p class="mt-2">
        A = ½ × 12 × 7 = <b>42 cm²</b>
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Circumference and Circle Measurements
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">Circumference: C = 2πr = πd</p>
      <p class="text-center font-semibold">Area: A = πr²</p>
      <p class="mt-2">
        The diameter is twice the radius: d = 2r.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 2</p>
      <p>A circle has a radius of 5. Find its area.</p>
      <p class="mt-2">A = π(5)² = <b>25π</b> square units.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Volume of Common Solids
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ul class="list-disc pl-5 space-y-2">
        <li><b>Rectangular prism:</b> V = lwh</li>
        <li><b>Cube:</b> V = s³</li>
        <li><b>Any prism:</b> V = Bh</li>
        <li><b>Cylinder:</b> V = πr²h</li>
        <li><b>Pyramid:</b> V = ⅓Bh</li>
        <li><b>Cone:</b> V = ⅓πr²h</li>
        <li><b>Sphere:</b> V = ⁴⁄₃πr³</li>
      </ul>
      <p class="text-xs mt-2">
        B represents the area of the base, and h is the perpendicular height.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 3</p>
      <p>
        A rectangular box is 4 cm long, 3 cm wide, and 8 cm high.
        Find its volume.
      </p>
      <p class="mt-2">
        V = 4 × 3 × 8 = <b>96 cm³</b>
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Surface Area
    </h3>

    <p class="mb-2">
      Surface area is the total area of all the outside faces of a solid.
      For a rectangular prism:
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-semibold">
        SA = 2lw + 2lh + 2wh
      </p>
      <p class="mt-2">
        For a cube, SA = 6s². Surface area is measured in square units,
        while volume is measured in cubic units.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      5. Composite Figures and Scaling
    </h3>

    <p class="mb-2">
      A composite figure is made of multiple shapes. Divide it into familiar
      shapes, calculate their areas or volumes, and then add or subtract
      as needed.
    </p>

    <p class="mb-2">
      When every linear dimension is multiplied by a scale factor k:
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ul class="list-disc pl-5 space-y-1">
        <li>Length changes by a factor of k.</li>
        <li>Area changes by a factor of k².</li>
        <li>Volume changes by a factor of k³.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold">Example 4</p>
      <p>
        The side length of a cube doubles. How does its volume change?
      </p>
      <p class="mt-2">
        New volume factor = 2³ = <b>8</b>.
      </p>
      <p>The new volume is 8 times the original volume.</p>
    </div>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-1">SAT Traps</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Using diameter instead of radius in circle formulas.</li>
        <li>Using a slanted side instead of perpendicular height.</li>
        <li>Confusing surface area with volume.</li>
        <li>Forgetting to square or cube the units in the answer.</li>
        <li>Doubling dimensions and assuming area or volume also only doubles.</li>
      </ul>
    </div>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-1">SAT Strategy</p>
      <p>
        Write the formula first, substitute the given measurements, and
        calculate carefully. Check whether the answer should use square
        units or cubic units. For composite shapes, split the figure into
        simpler pieces.
      </p>
    </div>

    <p class="italic text-[#1f9d8a] mt-4">
      SAT Tip: Area measures a flat surface, surface area measures the
      outside of a solid, and volume measures the space inside it.
    </p>
  </div>
`
THEORY[17] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Lines, Angles, and Triangles
    </h2>

    <p class="mb-3">
      SAT questions test angle relationships, parallel lines, triangle
      properties, and the Pythagorean theorem. Use these rules to find
      missing angles and side lengths.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Basic Angle Relationships
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Important Rules</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Complementary angles add up to 90°.</li>
        <li>Supplementary angles add up to 180°.</li>
        <li>Vertical angles are equal.</li>
        <li>Angles around a point add up to 360°.</li>
        <li>Angles on a straight line add up to 180°.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Vertical Angles</p>
      <svg viewBox="0 0 320 175" class="w-full max-w-sm mx-auto" role="img" aria-label="Two intersecting lines with vertical angles x and 65 degrees">
        <line x1="45" y1="145" x2="275" y2="25" stroke="#0f2b4a" stroke-width="2.5" />
        <line x1="45" y1="25" x2="275" y2="145" stroke="#0f2b4a" stroke-width="2.5" />
        <path d="M 160 85 L 182 73" stroke="#1f9d8a" stroke-width="3" />
        <text x="172" y="56" fill="#1f9d8a" font-size="17" font-weight="bold">65°</text>
        <text x="128" y="119" fill="#1f9d8a" font-size="18" font-weight="bold">x</text>
        <text x="12" y="165" fill="#0f2b4a" font-size="12">Vertical angles are equal</text>
      </svg>
      <p>
        Example: If one angle is 65°, the opposite angle is also 65°.
        Therefore, x = 65°.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example: Supplementary Angles</p>
      <p>
        Two angles form a straight line. One is 127°. Find the other angle.
      </p>
      <p class="mt-2 font-semibold">x + 127° = 180°</p>
      <p class="font-semibold">x = 53°</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Parallel Lines and Transversals
    </h3>

    <p class="mb-2">
      When a transversal crosses two parallel lines, special angle
      relationships appear.
    </p>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ul class="list-disc pl-5 space-y-1">
        <li>Corresponding angles are equal.</li>
        <li>Alternate interior angles are equal.</li>
        <li>Same-side interior angles add up to 180°.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Parallel Lines</p>
      <svg viewBox="0 0 320 200" class="w-full max-w-sm mx-auto" role="img" aria-label="A transversal crossing two parallel lines, with corresponding angles marked">
        <line x1="20" y1="55" x2="300" y2="55" stroke="#0f2b4a" stroke-width="2.5" />
        <line x1="20" y1="140" x2="300" y2="140" stroke="#0f2b4a" stroke-width="2.5" />
        <path d="M 65 175 L 235 20" stroke="#1f9d8a" stroke-width="2.5" />
        <path d="M 250 50 l 8 5 l -8 5 M 250 135 l 8 5 l -8 5" fill="none" stroke="#0f2b4a" stroke-width="2" />
        <path d="M 102 55 A 22 22 0 0 0 86 38" fill="none" stroke="#1f9d8a" stroke-width="2" />
        <text x="102" y="32" fill="#1f9d8a" font-size="14" font-weight="bold">115°</text>
        <text x="183" y="126" fill="#1f9d8a" font-size="15" font-weight="bold">x</text>
        <text x="20" y="190" fill="#0f2b4a" font-size="12">Parallel lines: corresponding angles match</text>
      </svg>
      <p>
        Example: If a corresponding angle is 115°, then x = 115°.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Triangle Angle Sum
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold text-center text-base mb-2">
        A + B + C = 180°
      </p>
      <p>
        The three interior angles of every triangle add up to 180°.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Find the Missing Angle</p>
      <svg viewBox="0 0 320 175" class="w-full max-w-sm mx-auto" role="img" aria-label="Triangle with angles 50 degrees, 60 degrees, and x">
        <path d="M 45 145 L 160 25 L 275 145 Z" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <text x="57" y="130" fill="#1f9d8a" font-size="16" font-weight="bold">50°</text>
        <text x="230" y="130" fill="#1f9d8a" font-size="16" font-weight="bold">60°</text>
        <text x="151" y="128" fill="#1f9d8a" font-size="18" font-weight="bold">x</text>
      </svg>
      <p class="font-semibold">50° + 60° + x = 180°</p>
      <p class="font-semibold">x = 70°</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Types of Triangles
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ul class="list-disc pl-5 space-y-2">
        <li>
          <strong>Equilateral:</strong> Three equal sides and three 60° angles.
        </li>
        <li>
          <strong>Isosceles:</strong> Two equal sides; the angles opposite
          those sides are equal.
        </li>
        <li>
          <strong>Scalene:</strong> No equal sides.
        </li>
        <li>
          <strong>Right triangle:</strong> One angle is exactly 90°.
        </li>
        <li>
          <strong>Acute triangle:</strong> All angles are less than 90°.
        </li>
        <li>
          <strong>Obtuse triangle:</strong> One angle is greater than 90°.
        </li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Isosceles Triangle</p>
      <svg viewBox="0 0 320 165" class="w-full max-w-sm mx-auto" role="img" aria-label="Isosceles triangle with two equal sides and equal base angles">
        <path d="M 70 140 L 160 25 L 250 140 Z" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <path d="M 111 89 l 9 7 M 200 96 l 9 -7" stroke="#1f9d8a" stroke-width="2.5" />
        <text x="82" y="128" fill="#1f9d8a" font-size="16" font-weight="bold">x</text>
        <text x="219" y="128" fill="#1f9d8a" font-size="16" font-weight="bold">x</text>
        <text x="140" y="155" fill="#0f2b4a" font-size="12">Equal base angles</text>
      </svg>
      <p>
        Example: An isosceles triangle has a vertex angle of 40°.
      </p>
      <p>Each base angle = (180° − 40°) ÷ 2 = 70°.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      5. Exterior Angles of a Triangle
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Exterior Angle Theorem</p>
      <p>
        An exterior angle equals the sum of the two opposite interior angles.
      </p>
      <p class="font-semibold text-center mt-2">
        Exterior angle = A + B
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example</p>
      <p>
        A triangle has two remote interior angles of 45° and 70°.
        Find the exterior angle.
      </p>
      <p class="font-semibold mt-2">x = 45° + 70° = 115°</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      6. The Pythagorean Theorem
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold text-center text-base mb-2">
        a² + b² = c²
      </p>
      <p>
        This formula works only for right triangles. The hypotenuse c is
        the side opposite the 90° angle and is always the longest side.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Right Triangle</p>
      <svg viewBox="0 0 320 180" class="w-full max-w-sm mx-auto" role="img" aria-label="Right triangle with legs 3 and 4 and hypotenuse 5">
        <path d="M 55 140 L 235 140 L 235 35 Z" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <path d="M 219 140 L 219 124 L 235 124" fill="none" stroke="#1f9d8a" stroke-width="2" />
        <text x="132" y="161" fill="#1f9d8a" font-size="16" font-weight="bold">4</text>
        <text x="245" y="91" fill="#1f9d8a" font-size="16" font-weight="bold">3</text>
        <text x="132" y="75" fill="#1f9d8a" font-size="16" font-weight="bold">5</text>
      </svg>
      <p class="font-semibold">3² + 4² = c²</p>
      <p class="font-semibold">9 + 16 = 25, so c = 5.</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      7. Special Right Triangles
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">45°–45°–90° Triangle</p>
      <p>Side ratio: x : x : x√2</p>
      <p class="mt-2 font-bold mb-1">30°–60°–90° Triangle</p>
      <p>Side ratio: x : x√3 : 2x</p>
      <p class="mt-2">
        In a 30°–60°–90° triangle, the shortest side is opposite 30°,
        and the hypotenuse is twice the shortest side.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      8. SAT Example
    </h3>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Question</p>
      <p>
        A triangle has angles x°, 2x°, and 3x°. What is the value of x?
      </p>
      <p class="mt-2">x + 2x + 3x = 180°</p>
      <p>6x = 180°</p>
      <p class="font-semibold">x = 30°</p>
      <p class="mt-2">
        The triangle's angles are 30°, 60°, and 90°.
      </p>
    </div>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-2">SAT Traps</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>
          Do not assume a diagram is drawn to scale.
        </li>
        <li>
          Vertical angles are equal, but adjacent angles are not always equal.
        </li>
        <li>
          The angles of a triangle must add up to 180°, not 360°.
        </li>
        <li>
          Use the Pythagorean theorem only when the triangle is right-angled.
        </li>
        <li>
          The longest side of a right triangle is always the hypotenuse.
        </li>
        <li>
          An exterior angle equals the sum of the two opposite interior angles.
        </li>
      </ul>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      SAT Strategy
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ol class="list-decimal pl-5 space-y-1">
        <li>Identify the angle or triangle relationship.</li>
        <li>Write the equation before calculating.</li>
        <li>Use 180° for straight lines and triangle angle sums.</li>
        <li>Use equal-side and equal-angle properties when applicable.</li>
        <li>For right triangles, check whether the Pythagorean theorem or a special ratio applies.</li>
      </ol>
    </div>

    <p class="italic text-[#1f9d8a] font-semibold mt-4">
      SAT Tip: Mark equal angles, parallel lines, and right angles on the
      diagram. A simple sketch with clear labels can reveal the entire solution.
    </p>
  </div>
`
THEORY[18] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Right Triangles and Trigonometry
    </h2>

    <p class="mb-3">
      Right triangles contain one 90° angle. On the SAT, you may need to
      find missing side lengths, calculate angles using trigonometric ratios,
      or apply special right-triangle properties.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Parts of a Right Triangle
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>Hypotenuse:</strong> The longest side, opposite the 90° angle.</li>
        <li><strong>Opposite side:</strong> The side across from the reference angle θ.</li>
        <li><strong>Adjacent side:</strong> The leg next to θ that is not the hypotenuse.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Label the Sides</p>
      <svg viewBox="0 0 320 190" class="w-full max-w-sm mx-auto" role="img" aria-label="Right triangle with opposite, adjacent and hypotenuse labeled relative to angle theta">
        <path d="M 45 145 L 255 145 L 255 35 Z" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <path d="M 239 145 L 239 129 L 255 129" fill="none" stroke="#1f9d8a" stroke-width="2" />
        <path d="M 85 145 A 40 40 0 0 0 73 116" fill="none" stroke="#1f9d8a" stroke-width="2" />
        <text x="65" y="135" fill="#1f9d8a" font-size="16" font-weight="bold">θ</text>
        <text x="130" y="166" fill="#0f2b4a" font-size="12">Adjacent</text>
        <text x="263" y="94" fill="#0f2b4a" font-size="12" transform="rotate(90 263 94)">Opposite</text>
        <text x="112" y="75" fill="#1f9d8a" font-size="13" font-weight="bold" transform="rotate(-28 112 75)">Hypotenuse</text>
      </svg>
      <p>
        The opposite and adjacent sides depend on which acute angle is being
        used. The hypotenuse never changes.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. The Pythagorean Theorem
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="text-center font-bold text-base mb-2">
        a² + b² = c²
      </p>
      <p>
        Use this formula to find a missing side of a right triangle.
        The variables a and b represent the legs, and c represents the hypotenuse.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example: Find the Hypotenuse</p>
      <svg viewBox="0 0 300 145" class="w-full max-w-sm mx-auto" role="img" aria-label="Right triangle with legs 6 and 8 and unknown hypotenuse">
        <path d="M 40 115 L 220 115 L 220 25 Z" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <path d="M 204 115 L 204 99 L 220 99" fill="none" stroke="#1f9d8a" stroke-width="2" />
        <text x="120" y="135" fill="#1f9d8a" font-size="16" font-weight="bold">8</text>
        <text x="231" y="75" fill="#1f9d8a" font-size="16" font-weight="bold">6</text>
        <text x="108" y="57" fill="#1f9d8a" font-size="16" font-weight="bold">c</text>
      </svg>
      <p>8² + 6² = c²</p>
      <p>64 + 36 = c²</p>
      <p>c² = 100</p>
      <p class="font-semibold">c = 10</p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example: Find a Missing Leg</p>
      <p>The hypotenuse is 13 and one leg is 5. Find the other leg x.</p>
      <p class="mt-2">x² + 5² = 13²</p>
      <p>x² = 169 − 25 = 144</p>
      <p class="font-semibold">x = 12</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. The Three Trigonometric Ratios
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold text-base mb-2">SOH – CAH – TOA</p>
      <p class="mb-1"><strong>Sine:</strong> sin(θ) = opposite / hypotenuse</p>
      <p class="mb-1"><strong>Cosine:</strong> cos(θ) = adjacent / hypotenuse</p>
      <p><strong>Tangent:</strong> tan(θ) = opposite / adjacent</p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: SOH–CAH–TOA</p>
      <svg viewBox="0 0 320 175" class="w-full max-w-sm mx-auto" role="img" aria-label="A 3-4-5 right triangle showing opposite side 3, adjacent side 4, hypotenuse 5">
        <path d="M 45 135 L 245 135 L 245 15 Z" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <path d="M 229 135 L 229 119 L 245 119" fill="none" stroke="#1f9d8a" stroke-width="2" />
        <text x="135" y="157" fill="#1f9d8a" font-size="15" font-weight="bold">Adjacent = 4</text>
        <text x="253" y="78" fill="#1f9d8a" font-size="13" font-weight="bold">Opp. = 3</text>
        <text x="115" y="65" fill="#1f9d8a" font-size="15" font-weight="bold" transform="rotate(-31 115 65)">Hyp. = 5</text>
        <text x="56" y="126" fill="#0f2b4a" font-size="15" font-weight="bold">θ</text>
      </svg>
      <p class="font-semibold">sin(θ) = 3/5 = 0.6</p>
      <p class="font-semibold">cos(θ) = 4/5 = 0.8</p>
      <p class="font-semibold">tan(θ) = 3/4 = 0.75</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Finding a Missing Side Using Trigonometry
    </h3>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example 1: Use Sine</p>
      <p>
        A right triangle has an angle of 30° and a hypotenuse of 10.
        Find the opposite side x.
      </p>
      <p class="mt-2">sin(30°) = x / 10</p>
      <p>0.5 = x / 10</p>
      <p class="font-semibold">x = 5</p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example 2: Use Cosine</p>
      <p>
        An angle is 60° and the hypotenuse is 12. Find the adjacent side x.
      </p>
      <p class="mt-2">cos(60°) = x / 12</p>
      <p>0.5 = x / 12</p>
      <p class="font-semibold">x = 6</p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example 3: Use Tangent</p>
      <p>
        An angle is 45° and the adjacent leg is 7. Find the opposite leg x.
      </p>
      <p class="mt-2">tan(45°) = x / 7</p>
      <p>1 = x / 7</p>
      <p class="font-semibold">x = 7</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      5. Special Right Triangles
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">45°–45°–90° Triangle</p>
      <svg viewBox="0 0 300 135" class="w-full max-w-sm mx-auto" role="img" aria-label="45-45-90 right triangle with equal legs x and hypotenuse x square root 2">
        <path d="M 50 105 L 210 105 L 210 25 Z" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <text x="110" y="125" fill="#1f9d8a" font-size="14" font-weight="bold">x</text>
        <text x="220" y="68" fill="#1f9d8a" font-size="14" font-weight="bold">x</text>
        <text x="110" y="53" fill="#1f9d8a" font-size="14" font-weight="bold">x√2</text>
        <text x="54" y="94" fill="#0f2b4a" font-size="12">45°</text>
        <text x="180" y="94" fill="#0f2b4a" font-size="12">45°</text>
      </svg>
      <p class="font-semibold text-center">Side ratio: 1 : 1 : √2</p>
      <p class="mt-2">
        The legs are equal. The hypotenuse equals a leg multiplied by √2.
      </p>
    </div>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">30°–60°–90° Triangle</p>
      <svg viewBox="0 0 300 155" class="w-full max-w-sm mx-auto" role="img" aria-label="30-60-90 right triangle with short leg x, long leg x square root 3 and hypotenuse 2x">
        <path d="M 40 125 L 245 125 L 245 7 Z" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <text x="126" y="146" fill="#1f9d8a" font-size="14" font-weight="bold">x√3</text>
        <text x="254" y="72" fill="#1f9d8a" font-size="14" font-weight="bold">x</text>
        <text x="130" y="54" fill="#1f9d8a" font-size="14" font-weight="bold">2x</text>
        <text x="47" y="115" fill="#0f2b4a" font-size="12">30°</text>
        <text x="208" y="115" fill="#0f2b4a" font-size="12">60°</text>
      </svg>
      <p class="font-semibold text-center">Side ratio: 1 : √3 : 2</p>
      <p class="mt-2">
        The shortest side is opposite 30°. The longest side, the hypotenuse,
        is twice the shortest side.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      6. Common Trigonometric Values
    </h3>

    <div class="overflow-x-auto mb-3">
      <table class="w-full border-collapse text-center">
        <thead>
          <tr class="bg-[#e8f7f4]">
            <th class="border border-gray-300 p-2">Angle</th>
            <th class="border border-gray-300 p-2">sin</th>
            <th class="border border-gray-300 p-2">cos</th>
            <th class="border border-gray-300 p-2">tan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-300 p-2">30°</td>
            <td class="border border-gray-300 p-2">1/2</td>
            <td class="border border-gray-300 p-2">√3/2</td>
            <td class="border border-gray-300 p-2">√3/3</td>
          </tr>
          <tr>
            <td class="border border-gray-300 p-2">45°</td>
            <td class="border border-gray-300 p-2">√2/2</td>
            <td class="border border-gray-300 p-2">√2/2</td>
            <td class="border border-gray-300 p-2">1</td>
          </tr>
          <tr>
            <td class="border border-gray-300 p-2">60°</td>
            <td class="border border-gray-300 p-2">√3/2</td>
            <td class="border border-gray-300 p-2">1/2</td>
            <td class="border border-gray-300 p-2">√3</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      7. Finding an Angle
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p>
        If two side lengths are known, inverse trigonometric functions can
        find an angle:
      </p>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li>θ = sin⁻¹(opposite / hypotenuse)</li>
        <li>θ = cos⁻¹(adjacent / hypotenuse)</li>
        <li>θ = tan⁻¹(opposite / adjacent)</li>
      </ul>
      <p class="mt-2">
        Make sure your calculator is set to degree mode when working with
        angles in degrees.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example</p>
      <p>
        A right triangle has an opposite side of 3 and a hypotenuse of 5.
        Find θ.
      </p>
      <p class="mt-2">sin(θ) = 3/5 = 0.6</p>
      <p>θ = sin⁻¹(0.6)</p>
      <p class="font-semibold">θ ≈ 36.9°</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      8. SAT Word Problem
    </h3>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Question</p>
      <p>
        A ladder 10 feet long leans against a vertical wall. The bottom of
        the ladder is 6 feet from the wall. How high up the wall does the
        ladder reach?
      </p>
      <p class="mt-2">Let h be the height.</p>
      <p>h² + 6² = 10²</p>
      <p>h² = 100 − 36 = 64</p>
      <p class="font-semibold">h = 8 feet</p>
    </div>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-2">SAT Traps</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>The hypotenuse is always opposite the right angle.</li>
        <li>SOH–CAH–TOA applies to right triangles.</li>
        <li>Choose opposite and adjacent relative to the angle in question.</li>
        <li>Do not confuse sin⁻¹(x) with 1/sin(x). It means inverse sine.</li>
        <li>Check whether the calculator is in degree mode.</li>
        <li>When solving for a side, keep units consistent.</li>
      </ul>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      SAT Strategy
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ol class="list-decimal pl-5 space-y-1">
        <li>Mark the right angle and identify the hypotenuse.</li>
        <li>Mark the reference angle θ.</li>
        <li>Label the opposite and adjacent sides.</li>
        <li>Use the Pythagorean theorem if two sides are involved.</li>
        <li>Use sine, cosine, or tangent when an angle and a side are given.</li>
        <li>Look for special triangle ratios before using a calculator.</li>
      </ol>
    </div>

    <p class="italic text-[#1f9d8a] font-semibold mt-4">
      SAT Tip: SOH–CAH–TOA helps you select the correct ratio. First identify
      the sides relative to θ, then write the equation, and only then solve.
    </p>
  </div>
`
THEORY[19] = `
  <div class="theory-box text-left text-sm text-[#0f2b4a]">
    <h2 class="text-xl font-bold text-[#1f9d8a] mb-3">
      Circles
    </h2>

    <p class="mb-3">
      SAT questions about circles involve radius, diameter, circumference,
      area, arcs, central angles, and equations of circles. Understanding
      these relationships helps you solve both numerical and algebraic problems.
    </p>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      1. Parts of a Circle
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>Center:</strong> The fixed point in the middle of a circle.</li>
        <li><strong>Radius (r):</strong> The distance from the center to the circle.</li>
        <li><strong>Diameter (d):</strong> A segment passing through the center and connecting two points on the circle.</li>
        <li><strong>Chord:</strong> A segment connecting two points on the circle.</li>
        <li><strong>Arc:</strong> A portion of the circle's circumference.</li>
        <li><strong>Tangent:</strong> A line that touches the circle at exactly one point.</li>
        <li><strong>Secant:</strong> A line that intersects the circle at two points.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Parts of a Circle</p>
      <svg viewBox="0 0 320 230" class="w-full max-w-sm mx-auto" role="img" aria-label="Circle showing center, radius, diameter, and chord">
        <circle cx="145" cy="112" r="75" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <line x1="70" y1="112" x2="220" y2="112" stroke="#1f9d8a" stroke-width="2.5" />
        <line x1="145" y1="112" x2="194" y2="55" stroke="#a65b00" stroke-width="2.5" />
        <line x1="88" y1="65" x2="202" y2="83" stroke="#6b7280" stroke-width="2.5" />
        <circle cx="145" cy="112" r="3.5" fill="#0f2b4a" />
        <text x="153" y="128" fill="#0f2b4a" font-size="12" font-weight="bold">Center</text>
        <text x="162" y="76" fill="#a65b00" font-size="12" font-weight="bold">Radius</text>
        <text x="108" y="102" fill="#1f9d8a" font-size="12" font-weight="bold">Diameter</text>
        <text x="111" y="57" fill="#6b7280" font-size="12" font-weight="bold">Chord</text>
      </svg>
      <p class="mt-2">
        The diameter is twice the radius:
        <strong> d = 2r</strong>, so <strong>r = d/2</strong>.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      2. Circumference and Area
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold text-base mb-2">Circumference</p>
      <p class="text-center font-bold text-lg">C = 2πr = πd</p>
      <p class="mt-2">
        Circumference measures the distance around a circle.
      </p>
      <p class="font-bold text-base mt-3 mb-2">Area</p>
      <p class="text-center font-bold text-lg">A = πr²</p>
      <p class="mt-2">
        Area measures the region enclosed by the circle.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Circumference vs. Area</p>
      <svg viewBox="0 0 320 145" class="w-full max-w-sm mx-auto" role="img" aria-label="Circle with circumference highlighted and area shaded">
        <circle cx="95" cy="70" r="48" fill="#d5f2ec" stroke="#1f9d8a" stroke-width="5" />
        <circle cx="230" cy="70" r="48" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <text x="95" y="132" fill="#1f9d8a" font-size="13" text-anchor="middle" font-weight="bold">Circumference</text>
        <text x="230" y="132" fill="#0f2b4a" font-size="13" text-anchor="middle" font-weight="bold">Area</text>
        <text x="95" y="74" fill="#0f2b4a" font-size="12" text-anchor="middle">Boundary</text>
        <text x="230" y="74" fill="#0f2b4a" font-size="12" text-anchor="middle">Inside</text>
      </svg>
      <p>
        Example: If r = 4, then C = 8π units and A = 16π square units.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example 1: Find the Area</p>
      <p>A circle has a diameter of 10. Find its area.</p>
      <p class="mt-2">r = 10/2 = 5</p>
      <p>A = π(5)²</p>
      <p class="font-semibold">A = 25π square units</p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example 2: Find the Radius</p>
      <p>A circle has circumference 18π. Find its radius.</p>
      <p class="mt-2">2πr = 18π</p>
      <p>2r = 18</p>
      <p class="font-semibold">r = 9</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      3. Central Angles and Arcs
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p>
        A central angle has its vertex at the center of the circle.
        Its degree measure equals the degree measure of its intercepted arc.
      </p>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li>A full circle measures 360°.</li>
        <li>A semicircle measures 180°.</li>
        <li>A quarter-circle measures 90°.</li>
        <li>The measures of all central angles add up to 360°.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Central Angle and Arc</p>
      <svg viewBox="0 0 320 190" class="w-full max-w-sm mx-auto" role="img" aria-label="Circle with a 90 degree central angle and a highlighted quarter-circle arc">
        <circle cx="145" cy="95" r="68" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <path d="M 145 95 L 213 95 A 68 68 0 0 0 145 27 Z" fill="#b9e9df" stroke="none" />
        <line x1="145" y1="95" x2="213" y2="95" stroke="#1f9d8a" stroke-width="2.5" />
        <line x1="145" y1="95" x2="145" y2="27" stroke="#1f9d8a" stroke-width="2.5" />
        <path d="M 163 95 A 18 18 0 0 0 145 77" fill="none" stroke="#1f9d8a" stroke-width="2" />
        <circle cx="145" cy="95" r="3" fill="#0f2b4a" />
        <text x="159" y="82" fill="#1f9d8a" font-size="13" font-weight="bold">90°</text>
        <text x="216" y="62" fill="#1f9d8a" font-size="12" font-weight="bold">Arc</text>
        <text x="145" y="180" fill="#0f2b4a" font-size="12" text-anchor="middle">Quarter-circle = 90°</text>
      </svg>
      <p>
        If a central angle measures 75°, its intercepted minor arc also measures 75°.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      4. Arc Length
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold text-center text-base mb-2">
        Arc length = (θ / 360°) × 2πr
      </p>
      <p>
        Here, θ is the central angle in degrees. The arc length is the
        corresponding fraction of the entire circumference.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example</p>
      <p>A circle has radius 6 and a central angle of 60°. Find the arc length.</p>
      <p class="mt-2">Arc length = (60/360) × 2π(6)</p>
      <p>= (1/6) × 12π</p>
      <p class="font-semibold">= 2π units</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      5. Sector Area
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold text-center text-base mb-2">
        Sector area = (θ / 360°) × πr²
      </p>
      <p>
        A sector is a region bounded by two radii and an arc. Its area is
        the same fraction of the circle's total area as its central angle
        is of 360°.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example</p>
      <p>A circle has radius 9 and a central angle of 40°. Find the sector area.</p>
      <p class="mt-2">Sector area = (40/360) × π(9)²</p>
      <p>= (1/9) × 81π</p>
      <p class="font-semibold">= 9π square units</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      6. Inscribed Angles
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold text-center text-base mb-2">
        Inscribed angle = ½ × intercepted arc
      </p>
      <p>
        An inscribed angle has its vertex on the circle. Its measure is
        half the measure of its intercepted arc.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Inscribed Angle</p>
      <svg viewBox="0 0 320 190" class="w-full max-w-sm mx-auto" role="img" aria-label="Inscribed angle intercepting an arc, with the center marked">
        <circle cx="145" cy="90" r="67" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <path d="M 93 48 A 67 67 0 0 1 197 48" fill="none" stroke="#1f9d8a" stroke-width="4" />
        <line x1="75" y1="125" x2="93" y2="48" stroke="#0f2b4a" stroke-width="2.5" />
        <line x1="75" y1="125" x2="197" y2="48" stroke="#0f2b4a" stroke-width="2.5" />
        <line x1="145" y1="90" x2="93" y2="48" stroke="#a65b00" stroke-width="1.8" stroke-dasharray="4 3" />
        <line x1="145" y1="90" x2="197" y2="48" stroke="#a65b00" stroke-width="1.8" stroke-dasharray="4 3" />
        <circle cx="145" cy="90" r="3" fill="#0f2b4a" />
        <text x="102" y="117" fill="#1f9d8a" font-size="13" font-weight="bold">x</text>
        <text x="122" y="35" fill="#1f9d8a" font-size="12" font-weight="bold">Arc</text>
        <text x="154" y="105" fill="#a65b00" font-size="11">Center</text>
        <text x="145" y="177" fill="#0f2b4a" font-size="12" text-anchor="middle">Inscribed angle is half the arc</text>
      </svg>
      <p>
        Example: If the intercepted arc measures 100°, the inscribed angle
        measures 100° ÷ 2 = 50°.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      7. Equation of a Circle
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p class="font-bold text-center text-base mb-2">
        (x − h)² + (y − k)² = r²
      </p>
      <p>
        This is the standard equation of a circle with center (h, k)
        and radius r.
      </p>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li>(h, k) gives the center.</li>
        <li>r is the radius, so r² is on the right side.</li>
        <li>The signs inside the parentheses are opposite the center coordinates.</li>
      </ul>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example: Identify the Center and Radius</p>
      <p>(x − 3)² + (y + 2)² = 25</p>
      <p class="mt-2">Center: (3, −2)</p>
      <p class="font-semibold">Radius: √25 = 5</p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Example: Write the Equation</p>
      <p>A circle has center (−4, 1) and radius 3.</p>
      <p class="mt-2">(x − (−4))² + (y − 1)² = 3²</p>
      <p class="font-semibold">(x + 4)² + (y − 1)² = 9</p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      8. Tangents and Radii
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <p>
        A radius drawn to the point where a tangent touches a circle is
        perpendicular to the tangent line.
      </p>
      <p class="font-semibold text-center mt-2">
        Radius ⟂ Tangent
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Picture: Tangent and Radius</p>
      <svg viewBox="0 0 320 175" class="w-full max-w-sm mx-auto" role="img" aria-label="Circle with a tangent line perpendicular to the radius at the point of contact">
        <circle cx="120" cy="85" r="55" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5" />
        <line x1="120" y1="85" x2="175" y2="85" stroke="#1f9d8a" stroke-width="2.5" />
        <line x1="175" y1="20" x2="175" y2="150" stroke="#a65b00" stroke-width="2.5" />
        <path d="M 163 85 L 163 73 L 175 73" fill="none" stroke="#1f9d8a" stroke-width="2" />
        <circle cx="120" cy="85" r="3" fill="#0f2b4a" />
        <text x="132" y="76" fill="#1f9d8a" font-size="12" font-weight="bold">r</text>
        <text x="183" y="35" fill="#a65b00" font-size="12" font-weight="bold">Tangent</text>
        <text x="120" y="164" fill="#0f2b4a" font-size="12" text-anchor="middle">90° at contact point</text>
      </svg>
      <p>
        Example: A radius of 5 meets a tangent at a right angle. If a point
        on the tangent is 12 units from the point of contact, its distance
        from the circle's center is √(5² + 12²) = 13.
      </p>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      9. SAT Example: A Change in Radius
    </h3>

    <div class="bg-gray-100 p-3 rounded-lg mb-3">
      <p class="font-bold mb-2">Question</p>
      <p>
        The radius of a circle increases from 4 to 8. How does its area change?
      </p>
      <p class="mt-2">Original area = π(4)² = 16π</p>
      <p>New area = π(8)² = 64π</p>
      <p class="font-semibold">The area becomes 4 times as large.</p>
      <p class="mt-2">
        Doubling the radius doubles the circumference but quadruples the area.
      </p>
    </div>

    <div class="bg-[#fff4e5] p-3 rounded-lg mb-3">
      <p class="font-bold text-[#a65b00] mb-2">SAT Traps</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Use the radius, not the diameter, in A = πr².</li>
        <li>Remember that circumference is a length, while area is measured in square units.</li>
        <li>Arc length and sector area use the fraction θ/360°.</li>
        <li>An inscribed angle is half its intercepted arc.</li>
        <li>In a circle equation, the radius is the square root of the right-hand side.</li>
        <li>Doubling the radius multiplies area by 4, not 2.</li>
        <li>Do not assume a diagram is drawn to scale.</li>
      </ul>
    </div>

    <h3 class="text-lg font-bold text-[#1f9d8a] mt-4 mb-2">
      SAT Strategy
    </h3>

    <div class="bg-[#e8f7f4] p-3 rounded-lg mb-3">
      <ol class="list-decimal pl-5 space-y-1">
        <li>Identify whether the question asks for circumference, area, arc length, or sector area.</li>
        <li>Convert diameter to radius when necessary.</li>
        <li>For arcs and sectors, determine the fraction of the full circle.</li>
        <li>For circle equations, compare the equation with standard form.</li>
        <li>Keep π exact unless a decimal approximation is requested.</li>
        <li>Check units: length uses units, and area uses square units.</li>
      </ol>
    </div>

    <p class="italic text-[#1f9d8a] font-semibold mt-4">
      SAT Tip: Memorize C = 2πr and A = πr². For arc length and sector area,
      multiply the full-circle formula by the fraction θ/360°.
    </p>
  </div>
`
;


/* ===== READING & WRITING THEORY (RTH[0..9]) ===== */
var RTH = [];

RTH[0] = `<h3>Central Ideas and Details</h3>
<p><b>Central Ideas and Details</b> questions test your ability to identify the main point of a short passage or locate a specific supporting detail explicitly stated in the text.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Core Strategy:</b> Read the entire passage first, identify the main subject and the author's primary claim about it, and predict the main idea in your own words before reading the choices.
</div>
<h3>1. Main Idea vs. Supporting Detail</h3>
<ul>
  <li><b>Main Idea:</b> Covers the passage as a whole (especially the introduction and conclusion sentences).</li>
  <li><b>Supporting Detail:</b> Mentions a specific example, date, study, or statistic used to illustrate the main point.</li>
</ul>
<h3>2. Common SAT Traps to Eliminate</h3>
<ul>
  <li><b>Too Narrow:</b> Focuses on a single sentence or example rather than the overarching point.</li>
  <li><b>Too Broad:</b> Makes a sweeping generalization beyond what the passage actually discusses.</li>
  <li><b>Distortion / Reversal:</b> Uses words from the passage but reverses the cause-and-effect or misstates a comparison.</li>
</ul>`;

RTH[1] = `<h3>Inferences</h3>
<p><b>Inferences</b> questions ask you to complete a passage with the most logical conclusion based strictly on the facts presented.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Golden Rule:</b> On the SAT, an inference is <i>not</i> a creative guess. It must be 100% supported by the logical premises given in the text.
</div>
<h3>How to Solve Inference Questions</h3>
<ul>
  <li><b>Step 1 — Break down the premises:</b> Identify Fact A + Fact B in the passage, paying close attention to transition words like <i>however</i>, <i>consequently</i>, and <i>therefore</i>.</li>
  <li><b>Step 2 — Connect the chain:</b> Ask yourself what must logically follow if all stated facts are true.</li>
  <li><b>Step 3 — Avoid extreme leaps:</b> Eliminate choices with unsupported absolutes (<i>always, never, completely, impossible</i>) or outside assumptions not mentioned in the text.</li>
</ul>`;

RTH[2] = `<h3>Command of Evidence (Textual &amp; Quantitative)</h3>
<p><b>Command of Evidence</b> questions ask you to select the quotation, research finding, or data from a table/graph that directly supports, illustrates, or weakens a specific claim.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Step 1:</b> Isolate the exact claim or hypothesis in the question stem before looking at the data or quotes.
</div>
<h3>1. Textual Evidence</h3>
<ul>
  <li>Find the exact claim being tested (e.g., a literary trait or scientific hypothesis).</li>
  <li>The correct choice must demonstrate <i>all parts</i> of that claim, not just mention the same topic.</li>
</ul>
<h3>2. Quantitative Evidence (Tables &amp; Graphs)</h3>
<ul>
  <li><b>First test — Data Accuracy:</b> Check row headers, column units, and years. Eliminate any choice that misreads the table or graph.</li>
  <li><b>Second test — Relevance to Claim:</b> Among accurate choices, keep only the one that directly proves or refutes the specific claim in the passage.</li>
</ul>`;

RTH[3] = `<h3>Words in Context</h3>
<p><b>Words in Context</b> questions ask you to choose the most precise word or phrase to complete a sentence or determine the meaning of a word in context.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Formula:</b> Context Clues + Tone (+/-) + Logical Trigger = Correct Word
</div>
<h3>Step-by-Step Approach</h3>
<ul>
  <li><b>1. Cover the choices:</b> Read the passage and underline the key context clue (often separated by a colon, semicolon, dash, or transition word).</li>
  <li><b>2. Predict your own word:</b> Put a simple word in the blank that matches the context clue.</li>
  <li><b>3. Match meaning, not familiarity:</b> Do not pick a word just because it sounds sophisticated—pick the choice whose exact definition matches your prediction.</li>
</ul>`;

RTH[4] = `<h3>Text Structure and Purpose</h3>
<p><b>Text Structure and Purpose</b> questions ask why the author wrote the passage as a whole, how the passage is organized, or what function an underlined sentence serves.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Ask:</b> "What is the author <i>doing</i> here?" (e.g., introducing a common belief and then challenging it with new findings).
</div>
<h3>Common SAT Passage Structures</h3>
<ul>
  <li><b>Old Idea &rarr; New Discovery:</b> Summarizes a conventional view, then introduces a study that complicates or refutes it.</li>
  <li><b>Question / Problem &rarr; Solution / Explanation:</b> Poses a puzzle or challenge and explains how researchers addressed it.</li>
  <li><b>Claim &rarr; Example / Illustration:</b> States a general principle and follows with a concrete case study.</li>
</ul>`;

RTH[5] = `<h3>Cross-Text Connections</h3>
<p><b>Cross-Text Connections</b> questions present two short passages (Text 1 and Text 2) on the same topic and ask how the authors would respond to each other.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Core Technique:</b> Summarize Text 1's main claim in 5 words, summarize Text 2's main claim in 5 words, and define their relationship (+ / - / qualified).
</div>
<h3>Typical Relationships Between Text 1 and Text 2</h3>
<ul>
  <li><b>Qualified Agreement:</b> Text 2 agrees with Text 1's basic premise but points out a limitation, exception, or overlooked factor.</li>
  <li><b>Direct Disagreement:</b> Text 2 offers an alternative explanation or challenges an assumption in Text 1.</li>
  <li><b>Support / Extension:</b> Text 2 provides concrete evidence or a real-world application of Text 1's theory.</li>
</ul>`;

RTH[6] = `<h3>Rhetorical Synthesis (Student Notes)</h3>
<p><b>Rhetorical Synthesis</b> questions give you a bulleted list of research notes and ask you to write a sentence that achieves a specific goal.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Speed Tip:</b> Read the <b>question prompt first</b>! Every single word in the goal description is a mandatory checklist item.
</div>
<h3>Checklist Method</h3>
<ul>
  <li>If the prompt asks for a <b>similarity</b>, eliminate choices that use contrast transitions (<i>however, whereas</i>).</li>
  <li>If the prompt asks to <b>emphasize a difference</b>, require both items and a clear contrast.</li>
  <li>If the prompt specifies <b>introducing a study and its findings to an unfamiliar audience</b>, ensure the choice explains who/what the subject is before stating the result.</li>
</ul>`;

RTH[7] = `<h3>Transitions</h3>
<p><b>Transitions</b> questions test your ability to choose the logical connector that bridges the idea before the blank and the idea after the blank.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Rule:</b> Ignore the transition choices first. Read Sentence 1 and Sentence 2, and classify their relationship into one of four categories.
</div>
<h3>The Big Four Transition Categories</h3>
<ul>
  <li><b>Contrast / Reversal:</b> <i>However, Nevertheless, Still, On the other hand, Conversely, By contrast</i></li>
  <li><b>Cause &amp; Effect:</b> <i>Therefore, Consequently, Thus, As a result, Accordingly, Hence</i></li>
  <li><b>Addition / Continuation:</b> <i>Furthermore, Moreover, In addition, Similarly, Likewise</i></li>
  <li><b>Example / Restating:</b> <i>For instance, For example, Specifically, In other words, Indeed</i></li>
</ul>`;

RTH[8] = `<h3>Boundaries (Punctuation &amp; Clauses)</h3>
<p><b>Boundaries</b> questions test how independent clauses (complete sentences) and dependent phrases are joined or separated using periods, semicolons, colons, dashes, and commas.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Comma Splice Alert:</b> Two independent clauses (IC + IC) can <b>NEVER</b> be joined by just a comma alone!
</div>
<h3>The 4 Legal Ways to Punctuate Clauses</h3>
<ul>
  <li><b>1. Period or Semicolon (IC ; IC):</b> Both sides must be standalone independent clauses.</li>
  <li><b>2. Comma + FANBOYS (IC, and/but/so IC):</b> Joins two independent clauses.</li>
  <li><b>3. Colon (IC : explanation/list/quote):</b> The clause before a colon <i>must</i> be a complete independent clause.</li>
  <li><b>4. Matching Pair of Dashes or Commas:</b> Used around nonessential interrupting phrases—never mix one dash with one comma!</li>
</ul>`;

RTH[9] = `<h3>Form, Structure, and Sense (Grammar Rules)</h3>
<p><b>Form, Structure, and Sense</b> covers Subject-Verb Agreement, Verb Tense, Pronoun Reference, Possessives, and Dangling Modifiers.</p>
<div class="bg-[#f0fbf8] p-3 rounded-lg my-3 border border-[#cfe8e2]">
  <b>Clue:</b> Look at how the 4 answer choices differ to immediately spot which grammar rule is being tested.
</div>
<h3>Top 4 Grammar Rules Tested on the SAT</h3>
<ul>
  <li><b>1. Subject-Verb Agreement:</b> Cross out prepositional phrases (<i>of..., in..., along with...</i>) between the subject and verb to match singular vs. plural.</li>
  <li><b>2. Dangling Modifiers:</b> When a sentence starts with an introductory modifying phrase (e.g., <i>"Trained as a botanist, _____"</i>), the very first noun after the comma <b>must</b> be the person or thing doing that action!</li>
  <li><b>3. Verb Tense &amp; Form:</b> Match the tense to surrounding verbs and time markers; remembers that <i>to + verb</i> or a participle (<i>-ing / -ed</i>) alone cannot act as the main verb of a clause.</li>
  <li><b>4. Pronouns &amp; Apostrophes:</b> Distinguish <i>its</i> (possessive) vs. <i>it's</i> (it is), and <i>their</i> (plural possessive) vs. <i>there</i>.</li>
</ul>`;
