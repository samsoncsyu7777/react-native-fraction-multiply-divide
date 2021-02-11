import React, { useState, useEffect } from "react";
import {
  widthPercentageToDP as wp2dp,
  heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import theme from "../Theme";
import {
  withTheme,
} from 'react-native-paper';
import {
  HeadingSelect,
} from "../components/MathsLearningComponents";
import {
  FractionMultiplyDivide,
} from "./FractionMultiplyDivide";
import pic1 from "../assets/cross5.jpg";
import pic2 from "../assets/cross6.jpg";
import pic3 from "../assets/neighbor1.jpg";
import prayerImage from "../assets/prayer4.jpg";
import constants from "../Constants";

const breakpoint = constants.breakpoint;

function MathsLearning(props) {
  const [languageIndex, setLanguageIndex] = useState(2);//0:繁體中文
  const [bibleVersionIndex, setBibleVersionIndex] = useState(0);//0:catholic,1:christian
  const [topicIndex, setTopicIndex] = useState(2);
  const [learningToolIndex, setLearningToolIndex] = useState(1);
  const [scriptureVerseIndex, setScriptureVerseIndex] = useState(0);

  const numberOfBibleVersions = 2;
  const numberOfTopics = 3;
  const numberOfLearningTools = 2;
  const numberOfScriptureVerses = 3;
  const scriptureImages = [pic1, pic2, pic3];
  const languages = ["繁體中文", "简体中文", "English", "Française"];
  const bibleVersions = ["天主教", "基督教", "天主教", "基督教", "Catholic", "Christian", "Catholique", "Chrétienne"];
  const bibleVersionsQuestion = ["經文版本", "经文版本", "Scripture version", "Version biblique"];
  const topics = [
    "分數乘法", "分數除法", "分數乘除混合",
    "分数乘法", "分数除法", "分数乘除混合",
    "Fractional Multiplication", "Fractional Division", "Fractional Multiplication and Division Mixed",
    "Multiplication fractionnaire", "Division fractionnaire", "Multiplication fractionnaire et division mixte"
  ];
  const topicsQuestion = ["主題", "主题", "Topic", "Sujet"];
  const learningTools = [
    "真分數計算", "帶分數計算", "真分數計算", "帶分數計算", "真分數計算", "帶分數計算",
    "真分数计算", "带分数计算", "真分数计算", "带分数计算", "真分数计算", "带分数计算",
    "Proper fraction", "Mixed fraction", "Proper fraction", "Mixed fraction", "Proper fraction", "Mixed fraction",
    "Proper fraction", "Mixed fraction", "Proper fraction", "Mixed fraction", "Proper fraction", "Mixed fraction"
  ];
  const learningToolsQuestion = [
    "分數類型", "分数类型", "Fraction Type", "Type de Fraction"
  ];
  const scriptureVerses = [//Genesis28:21-22, Leviticus27:30, Luke10:27, (next:Gen 41:34), 
    //traditional chinese
    "「上主實在當是我的天主。我立作石柱的這塊石頭，必要成為天主的住所；凡你賜與我的，我必給你奉獻十分之一。」創28:21-22",
    "凡土地的出產，或是田地的穀物，或是樹木的果實，十分之一應歸於上主，是獻於上主的聖物。肋27:30",
    "他答說：「你應當全心、全靈、全力、全意愛上主，你的天主；並愛近人如你自己。」路10:27",
    "「我就必以耶和華為我的神。我所立為柱子的這塊石頭必作神的殿；凡你所賜給我的，我必將十分之一獻給你。」創28:21-22",
    "地上所有的，無論是地上的種子，是樹上的果子，十分之一是耶和華的，是歸耶和華為聖的。利27:30",
    "他回答說：「你要盡心、盡性、盡力、盡意愛主—你的神，又要愛鄰如己。」路10:27",
    //simplified chinese
    "「上主实在当是我的天主。我立作石柱的这块石头，必要成为天主的住所；凡你赐与我的，我必给你奉献十分之一。」创28:21-22 ",
    "凡土地的出产，或是田地的谷物，或是树木的果实，十分之一应归于上主，是献于上主的圣物。肋27:30",
    "他答说：「你应当全心、全灵、全力、全意爱上主，你的天主；并爱近人如你自己。」路10:27",
    "「我就必以耶和华为我的神。我所立为柱子的这块石头必作神的殿；凡你所赐给我的，我必将十分之一献给你。」创28: 21-22",
    "地上所有的，无论是地上的种子，是树上的果子，十分之一是耶和华的，是归耶和华为圣的。利27:30",
    "他回答说：「你要尽心、尽性、尽力、尽意爱主—你的神，又要爱邻如己。」路10:27",
    //english
    "'Yahweh shall be my God. This stone I have set up as a pillar is to be a house of God, and I shall faithfully pay you a tenth part of everything you give me.'Genesis28:21-22",
    "All tithes on land, levied on the produce of the soil or on the fruit of trees, belong to Yahweh; they are consecrated to Yahweh.Leviticus27:30",
    "He replied, 'You must love the Lord your God with all your heart, with all your soul, with all your strength, and with all your mind, and your neighbour as yourself.'Luke10:27",
    "I will take the Lord to be my God, And this stone which I have put up for a pillar will be God's house: and of all you give me, I will give a tenth part to you.Genesis28:21-22",
    "And every tenth part of the land, of the seed planted, or of the fruit of trees, is holy to the Lord.Leviticus27:30",
    "And he, answering, said, Have love for the Lord your God with all your heart and with all your soul and with all your strength and with all your mind; and for your neighbour as for yourself.Luke10:27",
    //french
    "'Yahweh sera mon Dieu; cette pierre que j'ai dressée pour monument sera une maison de Dieu, et je vous paierai la dîme de tout ce que vous me donnerez.'Genèse28:21-22",
    "Toute dime de la terre, prélevée soit sur les semences de la terre, soit sur les fruits des arbres, appartient à Yahweh c'est une chose consacrée à Yahweh.Lévitique27:30",
    "Il répondit: 'Tu aimeras le Seigneur ton Dieu de tout coeur, de toute ton âme, de toute ta force et de tout ton esprit, et ton proche comme toi-même.'Luc10:27",
    "« Alors l'Eternel sera mon Dieu. Cette pierre dont j’ai fait un monument sera la maison de Dieu et je te donnerai la dîme de tout ce que tu me donneras. »Genèse28:21-22",
    "Toute dîme de la terre, soit des récoltes de la terre, soit du fruit des arbres, appartient à l'Eternel ; c'est une chose consacrée à l'Eternel.Lévitique27:30",
    "Il répondit : « Tu aimeras le Seigneur, ton Dieu, de tout ton cœur, de toute ton âme, de toute ta force et de toute ta pensée, et ton prochain comme toi-même. »Luc10:27"
  ];
  const prayers = [
    "主耶穌，求祢給我一顆願意奉獻的心，讓我更能全心、全意愛天上的父親！",
    "主耶稣，求祢给我一颗愿意奉献的心，让我更能全心、全意爱天上的父亲！",
    "Lord Jesus, please give me a heart that is willing to give, so that I can love my Father in heaven with all my heart and with all my soul!",
    "Seigneur Jésus, s'il te plaît, donne-moi un cœur prêt à donner, afin que je puisse aimer mon Père céleste de tout mon cœur et de toute mon âme!"
  ];
  const noticificationText = [
    "開啟通知，計算過程會顯示提示。",
    "开启通知，计算过程会显示提示。",
    "Turn on the notification, prompts will be displayed during the calculation.",
    "Activez la notification, des invites seront affichées pendant le calcul."
  ];
  const applicationHint = [
    "使用方法：先按空格，再輸入數字或運算符號。",
    "使用方法：先按空格，再输入数字或运算符号。",
    "How to use: Press the space first, then enter a number or an operator.",
    "Comment utiliser: appuyez d'abord sur l'espace, puis entrez un nombre ou un opérateur."
  ];

  useEffect(() => {
    setScriptureVerseIndex(Math.floor(Math.random() * numberOfScriptureVerses));
  }, []);

  return (
    <View style={styles.mathsLearningContainer} >
      <LinearGradient
        colors={['#FFEFEF', '#FFC0DF']}
        style={styles.linearGradient}
      >
        <ScrollView>
          <View style={styles.headingContainer}>
            <HeadingSelect
              selectLabel="Language"
              selectIndex={languageIndex}
              setItemIndex={setLanguageIndex}
              itemsArray={languages}
            />
            <HeadingSelect
              selectLabel={bibleVersionsQuestion[languageIndex]}
              selectIndex={bibleVersionIndex}
              setItemIndex={setBibleVersionIndex}
              itemsArray={bibleVersions.slice(languageIndex * numberOfBibleVersions, languageIndex * numberOfBibleVersions + numberOfBibleVersions)}
            />
            <HeadingSelect
              selectLabel={topicsQuestion[languageIndex]}
              selectIndex={topicIndex}
              setItemIndex={setTopicIndex}
              itemsArray={topics.slice(languageIndex * numberOfTopics, languageIndex * numberOfTopics + numberOfTopics)}
            />
            <HeadingSelect
              selectLabel={learningToolsQuestion[languageIndex]}
              selectIndex={learningToolIndex}
              setItemIndex={setLearningToolIndex}
              itemsArray={learningTools.slice((languageIndex * numberOfTopics + topicIndex) * numberOfLearningTools, (languageIndex * numberOfTopics + topicIndex + 1) * numberOfLearningTools)}
            />
          </View>
          <View style={styles.scriptureVerseRow} >
            <LinearGradient
              start={[0, 1]}
              end={[1, 0]}
              colors={['red', 'orange', 'yellow', 'green', 'lime', 'aqua', 'blue', 'magenta']}
              style={[styles.scriptureVerseBorder, styles.scriptureBorderWidth]}
            >
              <View style={[styles.scriptureVerseBorder, styles.scriptureBgColor]}>
                <Image style={styles.scriptureImage} source={scriptureImages[scriptureVerseIndex]} resizeMode="contain" />
                <Text style={styles.scriptureVerse}>{scriptureVerses[(languageIndex * numberOfBibleVersions + bibleVersionIndex) * numberOfScriptureVerses + scriptureVerseIndex]}</Text>
              </View>
            </LinearGradient>
          </View>
          <FractionMultiplyDivide
            languageIndex={languageIndex}
            topic={topics[languageIndex * numberOfTopics + topicIndex]}
            learningTool={learningTools[(languageIndex * numberOfTopics + topicIndex) * numberOfLearningTools + learningToolIndex]}
            topicIndex={topicIndex}
            learningToolIndex={learningToolIndex}
          />
          <View style={[styles.prayerRow, styles.topMargin]}>
            <Image style={styles.prayerImage} source={prayerImage} resizeMode="contain" />
            <Text style={styles.prayerText}>{prayers[languageIndex]}</Text>
          </View>
          <View style={styles.prayerRow}>
            <Text style={styles.commonText}>{applicationHint[languageIndex]}</Text>
          </View>
          <View style={styles.prayerRow}>
            <Text style={styles.commonText}>{noticificationText[languageIndex]}</Text>
          </View>
          <View style={styles.emailRow}>
            <Text style={styles.emailText}>samsoncsyuapple@gmail.com</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
/*

          <View style={{ width: 130, borderWidth: 5, borderColor: '#774400', borderRadius: 50}}>
            <LinearGradient
              start={[0, 1]}
              end={[1, 0]}
              colors={['red', 'yellow', 'yellow', 'red']}
              style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 18 , color: "#774400", fontWeight: 700}}>Fraction</Text>
              <Text style={{ fontSize: 18 , color: "#774400", fontWeight: 700}}>Multiplication</Text>
              <Text style={{ fontSize: 18 , color: "#774400", fontWeight: 700}}>Division</Text>
            </LinearGradient>
          </View>
*/

export default withTheme(MathsLearning);

const styles = StyleSheet.create({
  mathsLearningContainer: {
    margin: wp2dp('0.3%'),
    minHeight: hp2dp('97%'),
  },
  linearGradient: {
    margin: wp2dp('0.3%'),
    minHeight: hp2dp('97%'),
  },
  headingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scriptureVerseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scriptureBorderWidth: {
    width: wp2dp('100%') < breakpoint ? wp2dp('97%') : wp2dp('82%'),
  },
  scriptureVerseBorder: {
    flexDirection: "row",
    alignItems: "center",
    width: wp2dp('100%') < breakpoint ? wp2dp('95%') : wp2dp('80%'),
    margin: wp2dp('1%'),
  },
  scriptureBgColor: {
    backgroundColor: theme.colors.myWhite,
  },
  scriptureImage: {
    height: wp2dp('100%') < breakpoint ? wp2dp('16%') : wp2dp('8%'),
    width: wp2dp('100%') < breakpoint ? wp2dp('16%') : wp2dp('8%'),
    padding: wp2dp('0.5%'),
  },
  scriptureVerse: {
    width: wp2dp('100%') < breakpoint ? wp2dp('78%') : wp2dp('70%'),
    fontSize: wp2dp('100%') < breakpoint ? wp2dp('4%') : wp2dp('2%'),
    color: theme.colors.myGreen,
  },
  prayerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  prayerImage: {
    height: wp2dp('100%') < breakpoint ? wp2dp('12%') : wp2dp('8%'),
    width: wp2dp('100%') < breakpoint ? wp2dp('26%') : wp2dp('17%'),
    padding: wp2dp('0.5%'),
  },
  prayerText: {
    width: wp2dp('100%') < breakpoint ? wp2dp('70%') : wp2dp('65%'),
    fontSize: wp2dp('100%') < breakpoint ? wp2dp('4%') : wp2dp('2%'),
    color: theme.colors.myGreen,
  },
  topMargin: {
    marginTop: wp2dp('100%') < breakpoint ? wp2dp('4%') : wp2dp('2%'),
  },
  emailText: {
    width: wp2dp('92%'),
    textAlign: "right",
    fontSize: wp2dp('100%') < breakpoint ? wp2dp('3%') : wp2dp('1.5%'),
    color: theme.colors.myBrown,
    marginBottom: wp2dp('100%') < breakpoint ? wp2dp('15%') : wp2dp('0%'),
  },
  commonText: {
    fontSize: wp2dp('100%') < breakpoint ? wp2dp('2.8%') : wp2dp('1.4%'),
    textAlign: "center",
  },
});
