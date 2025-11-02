/**
 * Strips non-numeric characters from a string (allowing digits, a decimal point, and a minus sign),
 * then parses the cleaned result as a floating-point number.
 *
 * The regex used: /[^0-9.-]+/g
 * - This matches any sequence of characters that is NOT a digit (0-9), a dot (.), or a minus sign (-),
 *   and removes them from the input string.
 * - Example regex behavior:
 *   - "$1,234.56"  -> "1234.56"
 *   - "€-1.234,56" -> "-1.23456" (commas are removed; locale-specific formatting is not interpreted)
 *
 * Remarks:
 * - After cleaning, the remaining string is passed to parseFloat(). If parseFloat returns NaN,
 *   the function yields null.
 * - The implementation does not validate placement or multiplicity of dots/minus signs beyond what
 *   parseFloat naturally accepts (e.g., multiple dots may produce unexpected results).
 *
 * @param value - The input string potentially containing numeric characters and other formatting/symbols.
 * @returns The parsed numeric value, or null if the cleaned string cannot be parsed as a number.
 *
 * @example
 * // returns 1234.56
 * parseNumeric("$1,234.56");
 *
 * @example
 * // returns -12.34
 * parseNumeric("(-12.34)");
 *
 * @example
 * // returns null (no numeric content)
 * parseNumeric("abc");
 */
const parseNumeric = (value: string): number => {
  const numericString = value.replace(/[^0-9.-]+/g, "");
  const parsedNumber = parseFloat(numericString);
  if (isNaN(parsedNumber)) {
    throw new Error(`Unable to parse numeric value from input: "${value}"`);
  }

  return parsedNumber;
};

export default parseNumeric;
