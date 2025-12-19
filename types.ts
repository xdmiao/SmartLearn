
export enum Category {
  // 首页通用分类
  SCIENCE = '科学',
  HISTORY = '历史',
  LITERATURE = '文学',
  JAVASCRIPT = 'JavaScript',
  PHILOSOPHY = '哲学',
  MATH = '数学',

  // 面试题库分类
  ALIBABA = '阿里',
  NETEASE = '网易',
  DIDI = '滴滴',
  TOUTIAO = '今日头条',
  YOUZAN = '有赞',
  WACAI = '挖财',
  HUJIANG = '沪江',
  ELEME = '饿了么',
  CTRIP = '携程',
  XIMALAYA = '喜马拉雅',
  DUIBA = '兑吧',
  WEIYI = '微医',
  SECOO = '寺库',
  BABYTREE = '宝宝树',
  HIKVISION = '海康威视',
  MOGUJIE = '蘑菇街',
  KUJIALE = '酷家乐',
  BAIFENDIAN = '百分点'
}

export interface Question {
  id: string;
  title: string;
  category: Category;
  difficulty: '入门' | '进阶' | '专家';
  standardAnswer?: string;
  description?: string;
}

export interface AnswerState {
  isLoading: boolean;
  content: string | null;
  error: string | null;
}