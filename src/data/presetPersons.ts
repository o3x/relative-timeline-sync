/**
 * RelativeTimelineSync — プリセット偉人データ
 * Last Updated: Sat Jun 27 00:00:00 JST 2026
 */
import { FamousPerson } from "@/types"

export const PRESET_FAMOUS_PERSONS: FamousPerson[] = [
  {
    id: "steve-jobs",
    name: "スティーブ・ジョブズ",
    nameShort: "S.JOBS",
    birthDate: "1955-02-24",
    deathDate: "2011-10-05",
    description: "Apple共同創業者",
    accentColor: "#60a5fa",
    events: [
      { id: "sj-1", date: "1976-04-01", title: "Apple設立", description: "スティーブ・ウォズニアックとApple Computer Co.を共同創業" },
      { id: "sj-2", date: "1984-01-24", title: "Macintosh発売", description: "「1984年はジョージ・オーウェルの1984年にはならない」" },
      { id: "sj-3", date: "1985-09-13", title: "NeXT設立", description: "Appleを退社しNeXT Computer Inc.を設立" },
      { id: "sj-4", date: "1986-02-04", title: "Pixar取得", description: "ルーカスフィルムのグラフィクス部門を買収しPixarを設立" },
      { id: "sj-5", date: "1996-12-20", title: "Appleへ復帰", description: "NeXTのAppleへの売却によりAppleに復帰" },
      { id: "sj-6", date: "2001-10-23", title: "iPod発表", description: "「1000曲をポケットに」" },
      { id: "sj-7", date: "2003-04-28", title: "iTunes Store開始", description: "音楽配信を変革" },
      { id: "sj-8", date: "2007-06-29", title: "iPhone発売", description: "スマートフォンの概念を再定義" },
      { id: "sj-9", date: "2010-04-03", title: "iPad発売", description: "タブレットコンピュータ時代の幕開け" },
    ]
  },
  {
    id: "elon-musk",
    name: "イーロン・マスク",
    nameShort: "E.MUSK",
    birthDate: "1971-06-28",
    description: "Tesla・SpaceX CEO",
    accentColor: "#f87171",
    events: [
      { id: "em-1", date: "1995-11-01", title: "Zip2設立", description: "オンライン都市ガイドの会社を設立" },
      { id: "em-2", date: "1999-03-01", title: "X.com設立", description: "オンライン金融サービス会社を設立（後のPayPal）" },
      { id: "em-3", date: "2002-05-06", title: "SpaceX設立", description: "民間宇宙企業を設立。目標は火星移住" },
      { id: "em-4", date: "2004-02-01", title: "Tesla取締役会長就任", description: "電気自動車ベンチャーへの投資・参画" },
      { id: "em-5", date: "2008-09-28", title: "Falcon 1軌道投入成功", description: "民間企業初の液体燃料ロケット軌道投入" },
      { id: "em-6", date: "2010-06-04", title: "Falcon 9初打ち上げ", description: "大型再使用可能ロケットの初飛行" },
      { id: "em-7", date: "2012-05-22", title: "DragonがISSにドッキング", description: "民間宇宙船として初のISS到達" },
      { id: "em-8", date: "2015-12-21", title: "Falcon 9着陸成功", description: "ロケット第1段の垂直着陸に初成功" },
    ]
  },
  {
    id: "albert-einstein",
    name: "アルベルト・アインシュタイン",
    nameShort: "EINSTEIN",
    birthDate: "1879-03-14",
    deathDate: "1955-04-18",
    description: "理論物理学者。相対性理論の創始者",
    accentColor: "#4ade80",
    events: [
      { id: "ae-1", date: "1901-03-01", title: "スイス国籍取得", description: "ドイツ国籍を放棄し、スイス市民に" },
      { id: "ae-2", date: "1902-06-16", title: "特許局勤務開始", description: "ベルン特許局の審査官として勤務" },
      { id: "ae-3", date: "1905-03-17", title: "光電効果論文", description: "光量子仮説を提唱。のちにノーベル賞を受賞する業績" },
      { id: "ae-4", date: "1905-06-30", title: "特殊相対性理論", description: "「動く物体の電気力学について」を発表" },
      { id: "ae-5", date: "1905-09-27", title: "E=mc²発表", description: "質量とエネルギーの等価性を示す" },
      { id: "ae-6", date: "1915-11-25", title: "一般相対性理論完成", description: "重力を時空の曲率として記述" },
      { id: "ae-7", date: "1919-11-07", title: "一般相対性理論の実証", description: "日食観測により光の曲がりを確認。世界的有名人に" },
      { id: "ae-8", date: "1921-12-10", title: "ノーベル物理学賞受賞", description: "光電効果の発見により受賞" },
    ]
  },
  {
    id: "mozart",
    name: "ヴォルフガング・アマデウス・モーツァルト",
    nameShort: "MOZART",
    birthDate: "1756-01-27",
    deathDate: "1791-12-05",
    description: "作曲家。35年の生涯に600曲以上を残す",
    accentColor: "#c084fc",
    events: [
      { id: "mz-1", date: "1762-01-12", title: "ウィーン初演奏", description: "6歳で皇帝の前で演奏" },
      { id: "mz-2", date: "1763-06-09", title: "欧州演奏旅行開始", description: "父に連れられ3年間の欧州ツアー" },
      { id: "mz-3", date: "1769-05-01", title: "オペラ「ミトリダーテ」作曲開始", description: "13歳でミラノ公演向けオペラを依頼" },
      { id: "mz-4", date: "1781-03-16", title: "ウィーンへ移住", description: "大司教の宮廷から独立。フリーランス音楽家に" },
      { id: "mz-5", date: "1782-07-16", title: "コンスタンツェと結婚", description: "26歳で結婚。父の反対を押し切る" },
      { id: "mz-6", date: "1786-05-01", title: "フィガロの結婚初演", description: "オペラの傑作。ウィーンで大成功" },
      { id: "mz-7", date: "1787-10-29", title: "ドン・ジョヴァンニ初演", description: "プラハで初演。生涯最高傑作のひとつ" },
      { id: "mz-8", date: "1791-07-26", title: "魔笛完成", description: "死の5ヶ月前に完成した最後のオペラ" },
    ]
  },
  {
    id: "leonardo-da-vinci",
    name: "レオナルド・ダ・ヴィンチ",
    nameShort: "DA VINCI",
    birthDate: "1452-04-15",
    deathDate: "1519-05-02",
    description: "ルネサンスの万能人。画家・科学者・発明家",
    accentColor: "#fbbf24",
    events: [
      { id: "lv-1", date: "1472-06-01", title: "画家ギルド加入", description: "フィレンツェの画家組合に正式加入。師ヴェロッキオのもとを卒業" },
      { id: "lv-2", date: "1478-01-10", title: "初の独立依頼", description: "サン・ベルナルド礼拝堂の祭壇画を受注。初の個人依頼" },
      { id: "lv-3", date: "1482-01-01", title: "ミラノへ移住", description: "スフォルツァ公の宮廷へ。音楽家・エンジニアとして" },
      { id: "lv-4", date: "1495-01-01", title: "最後の晩餐制作開始", description: "サンタ・マリア・デッレ・グラーツィェ修道院の壁画" },
      { id: "lv-5", date: "1503-01-01", title: "モナ・リザ制作開始", description: "フランチェスコ・デル・ジョコンドの妻の肖像" },
      { id: "lv-6", date: "1509-01-01", title: "解剖学スケッチ", description: "30体以上の遺体を解剖。人体の詳細なスケッチを完成" },
      { id: "lv-7", date: "1516-01-01", title: "フランスへ移住", description: "フランソワ1世の招待でアンボワーズへ。モナ・リザを携行" },
    ]
  },
  {
    id: "marie-curie",
    name: "マリー・キュリー",
    nameShort: "M.CURIE",
    birthDate: "1867-11-07",
    deathDate: "1934-07-04",
    description: "物理学者・化学者。ノーベル賞を2分野で受賞した初の人物",
    accentColor: "#38bdf8",
    events: [
      { id: "mc-1", date: "1891-11-01", title: "パリ大学入学", description: "24歳でワルシャワからパリへ。物理学・数学を学ぶ" },
      { id: "mc-2", date: "1895-07-26", title: "ピエールと結婚", description: "共同研究者と結婚。科学者夫婦として歴史に残る" },
      { id: "mc-3", date: "1898-07-18", title: "ポロニウム発見", description: "放射性元素を発見。祖国ポーランドにちなみ命名" },
      { id: "mc-4", date: "1898-12-26", title: "ラジウム発見", description: "2番目の放射性元素を発見。「放射能」という言葉を創る" },
      { id: "mc-5", date: "1903-12-10", title: "ノーベル物理学賞受賞", description: "放射能研究によりピエールと共同受賞" },
      { id: "mc-6", date: "1911-12-10", title: "ノーベル化学賞受賞", description: "ラジウム・ポロニウムの発見により受賞。2分野での受賞は史上初" },
    ]
  },
]
