export const generateSecretSanta = (currentEmployees, previousAssignmentsMap, maxAttempts = 1000) => {
    if (currentEmployees.length < 2) {
        throw new Error('Not enough employees to assign Secret Santa.');
    }

    const employees = currentEmployees.map(e => ({
        ...e,
        email: e.Employee_EmailID.toLowerCase().trim()
    }));

    const previousMap = new Map();
    previousAssignmentsMap.forEach(pa => {
        const employeeEmail = pa.Employee_EmailID.toLowerCase().trim();
        const childEmail = pa.Secret_Child_EmailID.toLowerCase().trim();
        previousMap.set(employeeEmail, childEmail);
    });

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const assignments = greedyAssignment(employees, previousMap);
            if (assignments) {
                return assignments.map(assn => ({
                    ...assn,
                    Employee_EmailID: assn.Employee_EmailID,
                    Secret_Child_EmailID: assn.Secret_Child_EmailID
                }));
            }
        } catch (e) {
            continue;
        }
    }

    throw new Error('Failed to generate valid assignments after maximum attempts.');
};

const greedyAssignment = (employees, previousMap) => {
    const possibleChildren = new Map();
    employees.forEach(employee => {
        const prevChildEmail = previousMap.get(employee.email);
        const candidates = employees.filter(c => {
            const isSelf = c.email === employee.email;
            const isPrevious = prevChildEmail === c.email;
            return !isSelf && !isPrevious;
        });
        possibleChildren.set(employee.email, candidates);
    });

    const shuffledEmployees = shuffleArray([...employees]);
    const assigned = new Set();
    const assignments = [];

    for (const employee of shuffledEmployees) {
        const candidates = possibleChildren.get(employee.email).filter(c => !assigned.has(c.email));
        if (candidates.length === 0) {
            return null;
        }
        const selected = candidates[Math.floor(Math.random() * candidates.length)];
        assigned.add(selected.email);
        assignments.push({
            Employee_Name: employee.Employee_Name,
            Employee_EmailID: employee.email,
            Secret_Child_Name: selected.Employee_Name,
            Secret_Child_EmailID: selected.email
        });
    }

    return assignments;
};

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};