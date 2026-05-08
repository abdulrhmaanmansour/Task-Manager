test('empty task should fail', () => {
    const value = "";
    const result = value.trim() !== "";
    expect(result).toBe(false);
});

test('valid task should pass', () => {
    const value = "Study";
    const result = value.trim() !== "";
    expect(result).toBe(true);
});
