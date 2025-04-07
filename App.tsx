import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [isResult, setIsResult] = useState(false);
  const symbols = ["%", "÷", "×", "-", "+", "^", "("];

  const handleEdit = (value: string) => {
    const lastPointIndex = inputValue.lastIndexOf(".");
    const lastCharacter = inputValue[inputValue.length - 1];

    if (value == "()") {
      setInputValue(
        inputValue +
        (inputValue.lastIndexOf("(") > inputValue.lastIndexOf(")")
          ? ")"
          : "("),
      );
    } else if (
      value == "." &&
      (inputValue == "" || !lastCharacter.match(/[0-9]|\./))
    ) {
      setInputValue(inputValue + "0.");
    } else if (
      !(
        value == "." &&
        (lastCharacter == "." ||
          inputValue.substring(lastPointIndex).match(/\.\d+$/))
      ) &&
      !(symbols.includes(value) && inputValue == "" && value != "-")
      &&
      !(
        symbols.includes(value) &&
        symbols.includes(lastCharacter)
      )
    ) {
      setInputValue(inputValue + value);
    } else if (symbols.includes(lastCharacter) && value == "-") {
      setInputValue(inputValue + "(" + value);
    }
  };

  const handleClear = () => {
    if (isResult) {
      setInputValue("");
      setIsResult(false);
    } else {
      setInputValue(inputValue.substring(0, inputValue.length - 1));
    }
  };

  const handleResult = () => {
    const lastChar = inputValue[inputValue.length - 1];
    const hasNumber = inputValue.match(/[0-9]/);

    if (!symbols.includes(lastChar) || hasNumber) {
      try {
        const chars = inputValue.split('');
        let nOpenParenthesis = 0;
        let nClosedParenthesis = 0;

        for (let c of chars) {
          if (c === "(") {
            nOpenParenthesis++;
          }
        }

        for (let c of chars) {
          if (c === ")") {
            nClosedParenthesis++;
          }
        }

        let parenthesisToAdd = nOpenParenthesis - nClosedParenthesis;
        let parenthesis = "";

        for (let i = 0; i < parenthesisToAdd; i++) {
          parenthesis += ")";
        }

        const result = calculateResult(inputValue + parenthesis);
        setInputValue(result.toString());
        setIsResult(true);
      } catch (e) {
        setInputValue("Inválido!");
        setIsResult(true);
      }
    } else {
      setInputValue("Inválido!");
      setIsResult(true);
    }
  };

  const factorial = (value: number): number => {
    if (value === 0) {
      return 1;
    }

    return value * factorial(value - 1);
  }

  const calculateResult = (input: string) => {
    let expression = input
      .replaceAll("%", "/100*")
      .replaceAll("÷", "/")
      .replaceAll("×", "*")
      .replaceAll(/(-?\d+)\^(-?\d+)/g, "($1)**($2)")
      .replaceAll(/(-?\d+|\([^\)]+\))\^\((-?[\d+\-*/^()\.]+|\([^\)]+\))\)/g, "($1)**($2)")
      .replaceAll(/√\((\d+(.\d+)?)\)/g, "$1**(1/2)")
      .replaceAll(/(\d+)(\()/g, "$1*$2")
      .replaceAll(/(\))(\()/g, "$1*$2")
      .replaceAll(/(\))(\d+)/g, "$1*$2")
      .replaceAll(/log\((.*?)\)/g, "Math.log10($1)");
    const factorials = expression.matchAll(/(-?\d+|\([^\)]+\))\!/g);

    for (let match of factorials) {
      let value = match[1].startsWith('(') ? eval(match[1]) : parseInt(match[1]);
      expression = expression.replace(match[0], factorial(value).toString());
    }

    console.log(expression);

    const result = eval(expression);

    if (isNaN(result) || !isFinite(result)) {
      throw new Error("Inválido!");
    }

    return result;
  };

  const formatInput = (input: string) => {
    if (input.length > 10 && isResult) {
      return input.substring(0, 7) + "+" + (input.length - 7);
    }

    return input;
  };

  const CummonButton = ({ value }: Record<string, string>) => {
    let valueToUse = (value === "√" || value === "log") ? (value + "(") : value;

    return (
      <TouchableOpacity style={styles.btn} onPress={() => handleEdit(valueToUse)}>
        <Text>{value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.calculatorBody}>
        <View style={styles.solarPanelsDiv}>
          <View style={styles.solarPanel} />
          <View style={styles.solarPanel} />
          <View style={styles.solarPanel} />
          <View style={styles.solarPanel} />
        </View>
        <View style={styles.container}>
          <View style={styles.input}>
            <TextInput
              style={styles.inputText}
              value={formatInput(inputValue)}
              editable={false} />
          </View>
          <View style={styles.btnsDiv}>
            <View style={styles.btnsSpan}>
              <CummonButton value='()' />
              <CummonButton value="%" />
              <CummonButton value="^" />
              <TouchableOpacity
                style={[styles.btn, styles.clearBtn]}
                onPress={() => handleClear()}
                onLongPress={() => setInputValue("")}>
                <Text>C</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnsSpan}>
              <CummonButton value="√" />
              <CummonButton value="log" />
              <CummonButton value="!" />
              <CummonButton value="÷" />
            </View>
            <View style={styles.btnsSpan}>
              <CummonButton value="7" />
              <CummonButton value="8" />
              <CummonButton value="9" />
              <CummonButton value="×" />
            </View>
            <View style={styles.btnsSpan}>
              <CummonButton value="4" />
              <CummonButton value="5" />
              <CummonButton value="6" />
              <CummonButton value="-" />
            </View>
            <View style={styles.btnsSpan}>
              <CummonButton value="1" />
              <CummonButton value="2" />
              <CummonButton value="3" />
              <CummonButton value="+" />
            </View>
            <View style={styles.btnsSpan}>
              <CummonButton value="." />
              <CummonButton value="0" />
              <TouchableOpacity
                style={[styles.btn, styles.equalsBtn]}
                onPress={() => handleResult()}>
                <Text>=</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    margin: 0,
    padding: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "arial",
  },
  calculatorBody: {
    backgroundColor: "#606060",
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  solarPanelsDiv: {
    flexDirection: "row",
    gap: 2,
    backgroundColor: "#592018",
    alignSelf: "flex-end"
  },
  solarPanel: {
    width: 20,
    height: 35,
    backgroundColor: "#782a1f"
  },
  container: {
    width: 200,
    borderRadius: "10px",
    overflow: "hidden",
    gap: 20
  },
  input: {
    backgroundColor: "#333333",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  inputText: {
    fontSize: 25,
    color: "#fff",
  },
  btn: {
    backgroundColor: "#707070",
    color: "#fff",
    width: 50,
    height: 50,
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  equalsBtn: {
    width: 100,
    backgroundColor: "#6f8c74",
  },
  clearBtn: {
    backgroundColor: "#8c6f6f",
  },
  btnsDiv: {
    justifyContent: "space-between",
    flexDirection: "column",
  },
  btnsSpan: {
    flexDirection: "row",
    justifyContent: "space-between",
  }
});
