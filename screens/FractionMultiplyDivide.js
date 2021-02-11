import React, { useState, useEffect } from "react";
import {
  Button,
} from 'react-native-paper';
import {
  Text,
  View,
  TouchableOpacity,
  //Button,
} from "react-native";
import {
  widthPercentageToDP as wp2dp,
  heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';
import { AlertSnackbar } from "../components/AlertComponents";
import { MyFrame } from "../components/HeadingComponents";
import { MyKeypad } from "../components/KeypadComponents";
import { FractionFormula } from "../components/FractionFormulaComponents";
import { getPrimeNumbers } from "../functions/PrimeNumbersFunctions";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from "../styles";
import theme from "../Theme";
import constants from "../Constants";

const breakpoint = constants.breakpoint;

//×÷👍👍🏻
export const FractionMultiplyDivide = ({ languageIndex, topic, learningTool, topicIndex, learningToolIndex }) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [formulaFocusedIndex, setFormulaFocusedIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [fractionLinesArray, setFractionLinesArray] = useState([[["", 0, 0, 0, 0, 0], ["", 0, 0, 0, 0, 0]]]);
  const [fractionPositionIndex, setFractionPositionIndex] = useState(0);
  const [fractionPartIndex, setFractionPartIndex] = useState(3);
  const [okButtonStage, setOkButtonStage] = useState(0);
  const [calculationStage, setCalculationStage] = useState(0);//0:with mixed number, 1:with division, 2:need simplify, 3:with multiplication, 4:improper number, 5:completed
  const timeDelay = 200;
  const primeNumbers = getPrimeNumbers();

  const okButtonText = [
    "輸入", "約簡", "完成",
    "输入", "约简", "完成",
    "Enter", "Reduce?", "Completed",
    "Entrer", "Réduire?", "Terminé"
  ];

  const topics = [
    "",
    "",
    "",
    ""
  ];

  const wellDone = [
    "你做得到﹗你完成了這題分數計算﹗",
    "你做得到﹗你完成了这题分数计算﹗",
    "You can do it! You have completed this fraction calculation!",
    "Tu peux le faire! Vous avez terminé ce calcul de fraction!"
  ];

  const noOperator = [
    "這兒少了運算符號。",
    "这儿少了运算符号。",
    "Operators are missing here.",
    "Les opérateurs manquent ici."
  ];

  const noNumber = [
    "運算符號的前後需輸入分數或整數。",
    "运算符号的前后需输入分数或整数。",
    "There should be a whole number or an integer before and after an operator.",
    "Il doit y avoir un nombre entier ou un entier avant et après un opérateur."
  ];

  const fractionHasBoth = [
    "一個分數需同時有分子和分母。",
    "一个分数需同时有分子和分母。",
    "A fraction should both a numerator and a denominator.",
    "Une fraction doit à la fois un numérateur et un dénominateur."
  ];

  const noImproper = [
    "這兒有假分數，請輸入帶分數。",
    "这儿有假分数，请输入带分数。",
    "There are improper fractions, please enter a mixed number instead.",
    "Il y a des fractions incorrectes, veuillez saisir un nombre mixte à la place."
  ];

  const oneFractionOnly = [
    "相乘後，應只得一個分數。",
    "相乘后，应只得一个分数。",
    "You should only get one fraction after multiplication.",
    "Vous ne devriez obtenir qu'une fraction après la multiplication."
  ];

  const incorrectWhole = [
    "整數不正確，這應是分子除以分母得到的整數商。",
    "整数不正确，这应是分子除以分母得到的整数商。",
    "The whole number is incorrect. This should be the integer quotient obtained by dividing the numerator by the denominator.",
    "Le nombre entier est incorrect. Cela devrait être le quotient entier obtenu en divisant le numérateur par le dénominateur."
  ];

  const wholeNoFraction = [
    "這是整數，沒有分數部份。",
    "这是整数，没有分数部份。",
    "This is a whole number, it has no fractional part.",
    "C'est un nombre entier, il n'a pas de partie fractionnaire."
  ];

  const sameDenominator = [
    "分母應保持不變。",
    "分母应保持不变。",
    "The denominator should remain unchanged.",
    "Le dénominateur doit rester inchangé."
  ];

  const numeratorFromImproper = [
    "分子不正確，這應是分子除以分母得到的餘數。",
    "分子不正确，这应是分子除以分母得到的余数。",
    "The numerator is incorrect. This should be the remainder obtained by dividing the numerator by the denominator.",
    "Le numérateur est incorrect. Il doit s'agir du reste obtenu en divisant le numérateur par le dénominateur."
  ];

  const noMixed = [
    "在計算乘法或除法前，先將所有帶分數轉為假分數。",
    "在计算乘法或除法前，先将所有带分数转为假分数。",
    "All mixed fractions should be changed to improper fractions before multiplication or division.",
    "Toutes les fractions mélangées doivent être changées en fractions impropres avant la multiplication ou la division."
  ];

  const sameNumberOfFractions = [
    "這算式應與上一行算式有相同數量的分數。",
    "这算式应与上一行算式有相同数量的分数。",
    "This calculation should have the same number of fractions as the previous calculation.",
    "Ce calcul doit avoir le même nombre de fractions que le calcul précédent."
  ];

  const sameOperators = [
    "運算符號需保持不變。",
    "运算符号需保持不变。",
    "All operators should remain unchanged here.",
    "Tous les opérateurs devraient rester inchangés ici."
  ];

  const wholeToNumerator = [
    "整數部份應轉為 分子=整數，分母=1。",
    "整数部份应转为 分子=整数，分母=1。",
    "A whole number should be changed to a fraction with numerator=whole number and denominator=1.",
    "Un nombre entier doit être changé en une fraction avec numérateur=nombre entier et dénominateur=1."
  ];

  const mixedToNumerator = [
    "新分子應是 ( 整數×分母 + 分子 )。",
    "新分子应是 ( 整数×分母 + 分子 )。",
    "A new numerator should be ( whole number×denominator + numerator ).",
    "Un nouveau numérateur doit être (nombre entier × dénominateur + numérateur)."
  ];

  const noDivision = [
    "所有除法需轉為乘法。",
    "所有除法需转为乘法。",
    "All divisions should be changed to multiplications.",
    "Toutes les divisions devraient être changées en multiplications."
  ];

  const sameMultipliers = [
    "乘數和第一個分數需保持不變。",
    "乘数和第一个分数需保持不变。",
    "The multipliers and the first fraction should remain unchanged.",
    "Les multiplicateurs et la première fraction devraient rester inchangés."
  ];

  const divisorsUpDown = [
    "需把所有除數上下倒轉。",
    "需把所有除数上下倒转。",
    "All divisors should be turned upside down.",
    "Tous les diviseurs doivent être inversés."
  ];

  const simplifyIt = [
    "這不是最簡分數，請把它約簡。",
    "这不是最简分数，请把它约简。",
    "It is not an irreducible fraction. Please reduce it.",
    "Ce n'est pas une fraction irréductible. Veuillez la réduire."
  ];

  const productOfFractions = [
    "這分子應是上一行分子相乘的積，而分母也是上一行分母相乘的積。",
    "这分子应是上一行分子相乘的积，而分母也是上一行分母相乘的积。",
    "This numerator should be the product of the above numerators and this denominator should be the product of the above denominators too.",
    "Ce numérateur doit être le produit des numérateurs ci-dessus et ce dénominateur doit également être le produit des dénominateurs ci-dessus."
  ];

  const beAFactorOfNumerator = [
    "在約簡的過程中，新分子應是原本分子的因數。",
    "在约简的过程中，新分子应是原本分子的因数。",
    "The new numerator should be a factor of the original numerator in the process of reduction.",
    "Le nouveau numérateur doit être un facteur du numérateur d'origine dans le processus de réduction."
  ];

  const beAFactorOfDenominator = [
    "在約簡的過程中，新分母應是原本分母的因數。",
    "在约简的过程中，新分母应是原本分母的因数。",
    "The new denominator should be a factor of the original denominator in the process of reduction.",
    "Le nouveau dénominateur devrait être un facteur du dénominateur d'origine dans le processus de réduction."
  ];

  const sameFactorInReduction = [
    "約簡不正確，分子和分母需以相同的因數進行約簡。",
    "约简不正确，分子和分母需以相同的因数进行约简。",
    "The reduction is incorrect. The numerator and denominator must be reduced by the same factor.",
    "La réduction est incorrecte. Le numérateur et le dénominateur doivent être réduits du même facteur."
  ];

  const furtherReduceFactorLeft = [
    "這算式還能以",
    "这算式还能以",
    "This calculation can be further reduced by ",
    "Ce calcul peut être encore réduit par "
  ];

  const furtherReduceFactorRight = [
    "進行約簡",
    "进行约简",
    ".",
    "."
  ];

  const noMixedBeforeReduction = [
    "在進行約簡前，先把所有帶分數轉為假分數。",
    "在进行约简前，先把所有带分数转为假分数。",
    "All mixed fractions should be changed to improper fractions before reduction.",
    "Toutes les fractions mélangées doivent être remplacées par des fractions impropres avant réduction."
  ];

  const noDivisionBeforeReduction = [
    "在進行約簡前，先把所有除法轉為乘法。",
    "在进行约简前，先把所有除法转为乘法。",
    "All divisions should be changed to multiplications before reduction.",
    "Toutes les divisions devraient être changées en multiplications avant réduction."
  ];

  useEffect(() => {
    resetDefault();
  }, [learningToolIndex]);

  useEffect(() => {
    resetDefault();
  }, [topicIndex])

  const closeAlert = (e) => {
    setOpenAlert(false);
  };

  function resetDefault() {
    setSeverity("error");
    setFractionLinesArray([[["", 0, 0, 0, 0, 0], ["", 0, 0, 0, 0, 0]]]);
    setFormulaFocusedIndex(0);
    setCompleted(false);
    setOkButtonStage(0);
    setCalculationStage(0);
  }

  const resetClick = (e) => {
    if (completed) {
      resetDefault();
    } else if (okButtonStage > 0) {
      if (calculationStage == 2) {
        checkSimplifyValue(formulaFocusedIndex, false);
      } else {
        addLine();
      }
    }
  };

  function addLine() {
    setPartValue(0, -1, -1, true, false, false);
    setFormulaFocusedIndex(formulaFocusedIndex + 1);
    setOkButtonStage(0);
  }

  function fractionOrIntegerCheck(index) {
    var i;
    for (i = 0; i < fractionLinesArray[index].length - 1; i++) {
      if (i > 0 && fractionLinesArray[index][i][0] == "") {
        setErrorMessage(noOperator[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      }
      if (fractionLinesArray[index][i][1] == "" && fractionLinesArray[index][i][3] == "" & fractionLinesArray[index][i][4] == "") {
        setErrorMessage(noNumber[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      }
      if ((fractionLinesArray[index][i][3] == "" && fractionLinesArray[index][i][4] != "")
        || (fractionLinesArray[index][i][3] != "" && fractionLinesArray[index][i][4] == "")) {
        setErrorMessage(fractionHasBoth[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      }
    }
    return true;
  }

  function singleNumberCheck(index) {
    if (fractionLinesArray[index].length == 2) {
      if (index == 0) {
        setErrorMessage(noOperator[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      }
    }
    return true;
  }

  function noImproperFractionCheck(index, checkValueNeeded) {
    var i;
    for (i = 0; i < fractionLinesArray[index].length - 1; i++) {
      if (fractionLinesArray[index][i][3] >= fractionLinesArray[index][i][4] && fractionLinesArray[index][i][4] > 0) {
        if (!checkValueNeeded && index > 0) {
          addLine();
          return false;
        } else {
          setErrorMessage(noImproper[languageIndex]);
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
          return false;
        }
      }
    }
    if (index == 0) {
      return true;
    } else if (checkValueNeeded) {
      if (fractionLinesArray[index].length > 2) {
        setErrorMessage(oneFractionOnly[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      }
      for (i = 0; i < 1; i++) {
        var integerPart = fractionLinesArray[index][i][3];
        if (integerPart == "") {
          integerPart = 0;
        }
        if (fractionLinesArray[index][i][1] != parseInt(fractionLinesArray[index - 1][i][3] / fractionLinesArray[index - 1][i][4])) {
          setErrorMessage(incorrectWhole[languageIndex]);
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
          return false;
        }

        if (fractionLinesArray[index - 1][i][4] == 1) {
          if (fractionLinesArray[index][i][3] > 0 || fractionLinesArray[index][i][4] > 0) {
            setErrorMessage(wholeNoFraction[languageIndex]);
            setTimeout(() => {
              setOpenAlert(true);
            }, timeDelay);
            return false;
          }
        } else {
          if (fractionLinesArray[index][i][4] != fractionLinesArray[index - 1][i][4]) {
            setErrorMessage(sameDenominator[languageIndex]);
            setTimeout(() => {
              setOpenAlert(true);
            }, timeDelay);
            return false;
          }
          if (fractionLinesArray[index][i][3] != fractionLinesArray[index - 1][i][3] % fractionLinesArray[index - 1][i][4]) {
            setErrorMessage(numeratorFromImproper[languageIndex]);
            setTimeout(() => {
              setOpenAlert(true);
            }, timeDelay);
            return false;
          }
        }
      }
      if (calculationStage == 4) {
        setErrorMessage("👍🏻" + wellDone[languageIndex]);
        setFormulaFocusedIndex(formulaFocusedIndex + 1);
        setCompleted(true);
        setSeverity("success");
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
      }
      return true;
    } else {
      // if (calculationStage == 4) {
      setErrorMessage("👍🏻" + wellDone[languageIndex]);
      setFormulaFocusedIndex(formulaFocusedIndex + 1);
      setCompleted(true);
      setSeverity("success");
      setTimeout(() => {
        setOpenAlert(true);
      }, timeDelay);
      //}
      return true;
    }
  }

  function noMixedFractionCheck(index, checkValueNeeded) {
    var i;
    for (i = 0; i < fractionLinesArray[index].length - 1; i++) {
      if (fractionLinesArray[index][i][1] != "") {
        if (index != 0 && calculationStage == 0) {
          setErrorMessage(noMixed[languageIndex]);
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
        } else {
          addLine();
        }
        return false;
      }
    }
    if (index == 0 || !checkValueNeeded) {
      setCalculationStage(1);
      noDivisionCheck(index, false);
      return true;
    } else if (checkValueNeeded) {
      if (fractionLinesArray[index].length != fractionLinesArray[index - 1].length) {
        setErrorMessage(sameNumberOfFractions[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      }
      for (i = 0; i < fractionLinesArray[index].length - 1; i++) {
        if (fractionLinesArray[index][i][0] != fractionLinesArray[index - 1][i][0]) {
          setErrorMessage(sameOperators[languageIndex]);
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
          return false;
        }
        var calculatedNumerator = fractionLinesArray[index - 1][i][3] + fractionLinesArray[index - 1][i][1] * fractionLinesArray[index - 1][i][4];
        //whole number management
        if (!(fractionLinesArray[index - 1][i][3] > 0) && !(fractionLinesArray[index - 1][i][4] > 0)) {
          if (fractionLinesArray[index][i][3] != fractionLinesArray[index - 1][i][1] || fractionLinesArray[index][i][4] != 1) {
            setErrorMessage(wholeToNumerator[languageIndex]);
            setTimeout(() => {
              setOpenAlert(true);
            }, timeDelay);
            return false;
          }
        } else {
          if (fractionLinesArray[index][i][3] != calculatedNumerator) {
            setErrorMessage(mixedToNumerator[languageIndex]);
            setTimeout(() => {
              setOpenAlert(true);
            }, timeDelay);
            return false;
          }
          if (fractionLinesArray[index][i][4] != fractionLinesArray[index - 1][i][4]) {
            setErrorMessage(sameDenominator[languageIndex]);
            setTimeout(() => {
              setOpenAlert(true);
            }, timeDelay);
            return false;
          }
        }
      }
      setCalculationStage(1);
      noDivisionCheck(index, false);
      //setOkButtonStage(1);
      //addLine();
      return true;
    }
  }

  function noDivisionCheck(index, checkValueNeeded) {
    var i;
    for (i = 0; i < fractionLinesArray[index].length - 1; i++) {
      if (fractionLinesArray[index][i][0] == "÷") {
        if (index != 0 && calculationStage == 1) {
          setErrorMessage(noDivision[languageIndex]);
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
        } else {
          addLine();
        }
        return false;
      }
    }
    if (index == 0 || !checkValueNeeded) {
      setCalculationStage(2);
      setOkButtonStage(1);
      //addLine();
      //simplifiedCheck(index, false);
      return true;
    } else if (checkValueNeeded) {
      if (fractionLinesArray[index].length != fractionLinesArray[index - 1].length) {
        setErrorMessage(sameNumberOfFractions[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      }
      for (i = 0; i < fractionLinesArray[index].length - 1; i++) {
        if (fractionLinesArray[index][i][1] > 0) {
          setErrorMessage(noMixed[languageIndex]);
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
          return false;
        }
        if (i == 0 || fractionLinesArray[index - 1][i][0] == "×") {
          if (fractionLinesArray[index][i][3] != fractionLinesArray[index - 1][i][3]
            || fractionLinesArray[index][i][4] != fractionLinesArray[index - 1][i][4]) {
            setErrorMessage(sameMultipliers[languageIndex]);
            setTimeout(() => {
              setOpenAlert(true);
            }, timeDelay);
            return false;
          }
        } else if (fractionLinesArray[index - 1][i][0] == "÷") {
          if (fractionLinesArray[index][i][3] != fractionLinesArray[index - 1][i][4]
            || fractionLinesArray[index][i][4] != fractionLinesArray[index - 1][i][3]) {
            setErrorMessage(divisorsUpDown[languageIndex]);
            setTimeout(() => {
              setOpenAlert(true);
            }, timeDelay);
            return false;
          }
        }
      }
      setCalculationStage(2);
      setOkButtonStage(1);
      //simplifiedCheck(index, false);
      //addLine();
      return true;
    }
  }

  function noMultiplicationCheck(index, checkValueNeeded) {
    if (checkValueNeeded) {

      if (fractionLinesArray[index].length != 2) {
        setErrorMessage(oneFractionOnly[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      }
      var i;
      var numerator = 1;
      var denominator = 1;
      for (i = 0; i < fractionLinesArray[index - 1].length - 1; i++) {
        numerator *= fractionLinesArray[index - 1][i][3];
        denominator *= fractionLinesArray[index - 1][i][4];
      }
      if (fractionLinesArray[index][0][3] != numerator || fractionLinesArray[index][0][4] != denominator) {
        setErrorMessage(productOfFractions[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      }
      for (i = 0; i < primeNumbers.length; i++) {
        if (fractionLinesArray[index][0][3] % primeNumbers[i] == 0 && fractionLinesArray[index][0][4] % primeNumbers[i] == 0) {
          setErrorMessage(simplifyIt[languageIndex]);
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
          setOkButtonStage(1);
          return false;
        }
      }
      setCalculationStage(4);
      setOkButtonStage(1);
      noImproperFractionCheck(index, false);
      //addLine();
      return true;
    }
    setCalculationStage(4);
    noImproperFractionCheck(index, false);
    return true;
  }

  function enterCheck() {
    if (!fractionOrIntegerCheck(formulaFocusedIndex)) { return };
    if (formulaFocusedIndex == 0) {
      if (!singleNumberCheck(formulaFocusedIndex)) { return };
      if (!noImproperFractionCheck(formulaFocusedIndex, false)) { return };
      noMixedFractionCheck(formulaFocusedIndex, false);
      //setOkButtonStage(1);
    } else {
      switch (calculationStage) {
        case 0:
          if (fractionOrIntegerCheck(formulaFocusedIndex)) {
            noMixedFractionCheck(formulaFocusedIndex, true);
          }
          break;
        case 1:
          if (fractionOrIntegerCheck(formulaFocusedIndex)) {
            noDivisionCheck(formulaFocusedIndex, true);
          }
          break;
        case 2:
          //simplifiedCheck(formulaFocusedIndex, true);
          if (fractionOrIntegerCheck(formulaFocusedIndex)) {
            setOkButtonStage(1);
            //noMultiplicationCheck(formulaFocusedIndex, true);
          }
          break;
        case 3:
          if (fractionOrIntegerCheck(formulaFocusedIndex)) {
            noMultiplicationCheck(formulaFocusedIndex, true);
          }
          break;
        case 4:
          if (fractionOrIntegerCheck(formulaFocusedIndex)) {
            noImproperFractionCheck(formulaFocusedIndex, true);
          }
          break;
      }
    }
  }

  function checkSimplifyValue(index, checkValue) {
    var newNumerator = 1;
    var newDenominator = 1;
    var numeratorDeduceFactor = 1;
    var denominatorDeduceFactor = 1;
    var i;
    for (i = 0; i < fractionLinesArray[index].length - 1; i++) {
      if (fractionLinesArray[index][i][2] > 0) {
        if (fractionLinesArray[index][i][3] % fractionLinesArray[index][i][2] == 0) {
          newNumerator *= fractionLinesArray[index][i][2];
          numeratorDeduceFactor *= fractionLinesArray[index][i][3] / fractionLinesArray[index][i][2];
        } else {
          setErrorMessage(beAFactorOfNumerator[languageIndex]);
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
          return false;
        }
      } else {
        newNumerator *= fractionLinesArray[index][i][3];
      }
      if (fractionLinesArray[index][i][5] > 0) {
        if (fractionLinesArray[index][i][4] % fractionLinesArray[index][i][5] == 0) {
          newDenominator *= fractionLinesArray[index][i][5];
          denominatorDeduceFactor *= fractionLinesArray[index][i][4] / fractionLinesArray[index][i][5];
        } else {
          setErrorMessage(beAFactorOfDenominator[languageIndex]);
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
          return false;
        }
      } else {
        newDenominator *= fractionLinesArray[index][i][4];
      }
    }
    if (numeratorDeduceFactor != denominatorDeduceFactor) {
      setErrorMessage(sameFactorInReduction[languageIndex]);
      setTimeout(() => {
        setOpenAlert(true);
      }, timeDelay);
      return false;
    }
    for (i = 0; i < primeNumbers.length; i++) {
      if (newNumerator % primeNumbers[i] == 0 && newDenominator % primeNumbers[i] == 0) {
        setErrorMessage(furtherReduceFactorLeft[languageIndex] + primeNumbers[i] + furtherReduceFactorRight[languageIndex]);
        setTimeout(() => {
          setOpenAlert(true);
        }, timeDelay);
        return false;
      } else {
        if (primeNumbers[i] ** 2 > newNumerator && primeNumbers[i] ** 2 > newDenominator) {
          i = primeNumbers.length;
        }
      }
    }
    for (i = 0; i < fractionLinesArray[index].length - 1; i++) {
      if (fractionLinesArray[index][i][2] > 0) {
        setPartValue(fractionLinesArray[index][i][2], i, 3, false, false, false);
      }
      if (fractionLinesArray[index][i][5] > 0) {
        setPartValue(fractionLinesArray[index][i][5], i, 4, false, false, false);
      }
    }
    setCalculationStage(3);
    setOkButtonStage(0);
    if (checkValue) {
      //noMultiplicationCheck(index, false);
    }
    addLine();
    return true;

  }

  const okClick = (e) => {
    switch (okButtonStage) {
      case 0:
        enterCheck();
        break;
      case 1:
        if (calculationStage > 1) {
          setFractionPartIndex(2);
          setOkButtonStage(2);
        } else {
          if (calculationStage == 0) {
            setErrorMessage(noMixedBeforeReduction[languageIndex]);
          } else {
            setErrorMessage(noDivisionBeforeReduction[languageIndex]);
          }
          setTimeout(() => {
            setOpenAlert(true);
          }, timeDelay);
        }
        break;
      case 2:
        checkSimplifyValue(formulaFocusedIndex, true);
        break;
    }
  };

  const handleKeypadClick = (e, key) => {
    var pushLine = false;
    var pushPosition = false;
    if (formulaFocusedIndex == fractionLinesArray.length - 1) {
      if ((["×", "÷"].includes(key) && fractionPartIndex == 0 && fractionLinesArray[formulaFocusedIndex][fractionPositionIndex][fractionPartIndex] == "")
        || (!["×", "÷"].includes(key) && fractionPartIndex != 0 && (fractionLinesArray[formulaFocusedIndex][fractionPositionIndex][fractionPartIndex] != "" || key != "0"))
        || key == "<") {
        if (["×", "÷"].includes(key) && fractionPositionIndex == fractionLinesArray[formulaFocusedIndex].length - 1) {
          pushPosition = true;
        }
        var tmpFractionLinesArray = [...fractionLinesArray];
        var prevValue = tmpFractionLinesArray[formulaFocusedIndex][fractionPositionIndex][fractionPartIndex];
        if (key == "<") {
          if (fractionPartIndex == 0) {
            prevValue = "";
          } else {
            if (prevValue != "") {
              prevValue = parseInt(prevValue / 10);
              if (prevValue == 0) {
                //prevValue = "";
              }
            }
          }
          //prevValue = prevValue.slice(0, -1);
        } else {
          prevValue += key;
        }
        if (fractionPartIndex != 0) {//
          prevValue = parseInt(prevValue);//
        }
        setPartValue(prevValue, fractionPositionIndex, fractionPartIndex, pushLine, pushPosition, false);
      }
    }
  }

  function setPartValue(value, positionIndex, partIndex, pushLine, pushPosition, popPosition) {
    var nullPosition = false;
    setFractionLinesArray(prevLines => {
      var tmpPrevLines = prevLines.map((line, lIndex) => {
        if (lIndex == formulaFocusedIndex) {
          var tmpLine = line.map((position, pIndex) => {
            if (pIndex == positionIndex) {
              var changedPosition = position.map((part, index) => {
                if (index == partIndex) {
                  return value;
                } else {
                  return part;
                }
              })
              if (pIndex == fractionLinesArray[formulaFocusedIndex].length - 2 && pIndex > 0) {
                if (changedPosition[0] == "" && !(changedPosition[1] > 0) && !(changedPosition[3] > 0) && !(changedPosition[4] > 0)) {
                  nullPosition = true;
                }
              }
              return changedPosition
            } else {
              return position;
            }
          })
          if (pushPosition) {
            tmpLine.push(["", 0, 0, 0, 0, 0]);
          }
          if (popPosition || nullPosition) {
            tmpLine.pop();
          }
          return tmpLine;

        } else {
          return line;
        }
      })
      if (pushLine) {
        tmpPrevLines.push([["", 0, 0, 0, 0, 0], ["", 0, 0, 0, 0, 0]]);
      }
      return tmpPrevLines
    });
  }

  const handlePartClick = (e, positionIndex, partIndex) => {
    //in simplification, only small boxes can be focused
    if ((okButtonStage == 2 && (partIndex == 2 || partIndex == 5)) || okButtonStage != 2) {
      setFractionPositionIndex(positionIndex);
      setFractionPartIndex(partIndex);
    }
  }

  return (
    <MyFrame topic={topics[languageIndex] + topic} learningTool={learningTool}>
      <View style={styles.centerRow}>
        <View style={styles.formulaColumn}>
          {
            fractionLinesArray.map((formula, index) => {
              return <View key={index} style={[styles.verticalCenterRow, styles.commonPadding]}>
                <Text
                  style={[styles.formulaLine, { opacity: index == 0 ? 0 : 1 }]}
                >=</Text>
                <View
                  style={[styles.formulaLine, styles.formulaBox, {
                    borderWidth: (index == formulaFocusedIndex) ? 3 : 1,
                    borderColor: (index == formulaFocusedIndex) ? theme.colors.myMagenta : theme.colors.blue
                  }]}
                >
                  <FractionFormula
                    formula={formula}
                    handlePartClick={handlePartClick}
                    isFocusedLine={(formulaFocusedIndex == index)}
                    positionIndex={fractionPositionIndex}
                    partIndex={fractionPartIndex}
                    learningToolIndex={learningToolIndex}
                    showSmallInput={(okButtonStage == 2) && (index == formulaFocusedIndex)}
                    calculationStage={calculationStage}
                    lineIndex={index}
                  />
                </View>
                <View>
                  {
                    index == formulaFocusedIndex &&
                    <TouchableOpacity
                      style={styles.okButton}
                      onPress={okClick}
                    >
                      <Text style={styles.okButtonText}>
                        {okButtonText[languageIndex * 3 + okButtonStage]}
                      </Text>
                    </TouchableOpacity>
                  }
                  {
                    index == fractionLinesArray.length - 1
                    && (okButtonStage == 1 || completed)
                    &&
                    <TouchableOpacity
                      style={styles.okButton}
                      onPress={resetClick}
                    >
                      <MaterialIcons name="forward" color={'white'} size={parseInt(wp2dp('100%') < breakpoint ? wp2dp('5%') : wp2dp('2%'))} />
                    </TouchableOpacity>
                  }
                </View>
              </View>
            })
          }
        </View>
      </View>
      <MyKeypad
        handleClick={handleKeypadClick}
        topicIndex={topicIndex}
        formulaFocusedIndex={formulaFocusedIndex}
      />
      <AlertSnackbar
        open={openAlert}
        closeAlert={closeAlert}
        errorMessage={errorMessage}
        severity={severity}
      />
    </MyFrame>
  );
}
