# FlowNote API 文档

本文档介绍 FlowNote 的内部 API 和数据结构。

---

## 数据结构

### Idea (灵感)

```typescript
interface Idea {
  id: string           // UUID 唯一标识
  title: string        // 标题
  content: string      // 内容
  tags: string[]       // 标签数组
  createdAt: number    // 创建时间戳 (ms)
}
```

**示例**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "新产品想法",
  "content": "开发一个笔记应用...",
  "tags": ["产品", "创业"],
  "createdAt": 1713500000000
}
```

### JournalEntry (日记)

```typescript
type Mood = 'happy' | 'calm' | 'sad' | 'excited' | 'tired' | 'anxious'

interface JournalEntry {
  id: string           // UUID
  date: string         // YYYY-MM-DD 格式
  content: string      // 日记内容
  mood: Mood           // 心情
  createdAt: number    // 创建时间戳
}
```

**示例**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "date": "2024-04-19",
  "content": "今天是个好日子...",
  "mood": "happy",
  "createdAt": 1713500000000
}
```

### Transaction (交易)

```typescript
type TransactionType = 'income' | 'expense'
type ExpenseCategory = '餐饮' | '交通' | '购物' | '娱乐' | '居住' | '医疗' | '教育' | '其他'
type IncomeCategory = '工资' | '投资' | '兼职' | '奖金' | '其他'
type Category = ExpenseCategory | IncomeCategory

interface Transaction {
  id: string           // UUID
  amount: number       // 金额
  type: TransactionType
  category: Category
  date: string         // YYYY-MM-DD
  note?: string        // 备注（可选）
  createdAt: number
}
```

**示例**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "amount": 35.50,
  "type": "expense",
  "category": "餐饮",
  "date": "2024-04-19",
  "note": "午餐",
  "createdAt": 1713500000000
}
```

---

## Storage API

### storage.setItem

保存数据（自动分片）。

```typescript
storage.setItem(key: string, data: unknown): boolean
```

**参数**:
- `key`: 存储键名
- `data`: 任意可序列化数据

**返回**: 是否成功

**示例**:
```typescript
import { storage } from '@/lib/storage'

const ideas: Idea[] = [...]
storage.setItem('flownote-ideas', ideas)
```

### storage.getItem

读取数据（自动合并分片）。

```typescript
storage.getItem<T>(key: string): T | null
```

**参数**:
- `key`: 存储键名

**返回**: 解析后的数据或 null

**示例**:
```typescript
const ideas = storage.getItem<Idea[]>('flownote-ideas') || []
```

### storage.removeItem

删除数据及分片。

```typescript
storage.removeItem(key: string): void
```

### storage.getUsage

获取存储使用情况。

```typescript
storage.getUsage(): {
  used: number      // 已用字节
  total: number     // 总配额（估算 5MB）
  percentage: number // 使用百分比
}
```

**示例**:
```typescript
const { used, percentage } = storage.getUsage()
console.log(`已使用: ${(used / 1024).toFixed(2)} KB (${percentage.toFixed(1)}%)`)
```

### storage.clearAll

清除所有 FlowNote 数据。

```typescript
storage.clearAll(): void
```

---

## I18n API

### useI18n Hook

```typescript
const { t, locale, setLocale } = useI18n()
```

#### t (翻译函数)

```typescript
t(key: string): string
```

**示例**:
```typescript
t('ideas.title')        // "灵感笔记"
t('journal.moods.happy') // "开心"
```

支持嵌套键，使用 `.` 分隔。

#### locale

当前语言: `'zh' | 'en'`

#### setLocale

切换语言。

```typescript
setLocale(locale: 'zh' | 'en'): void
```

**示例**:
```typescript
setLocale('en')  // 切换到英文
```

---

## 工具函数

### cn

合并 Tailwind 类名。

```typescript
cn(...inputs: ClassValue[]): string
```

**示例**:
```typescript
import { cn } from '@/lib/utils'

const className = cn(
  'px-4 py-2 rounded',
  isPrimary && 'bg-primary text-white',
  isLarge && 'text-lg'
)
```

### formatDate ( Ideas )

格式化日期。

```typescript
formatDate(timestamp: number, locale: string): string
// 返回: "Apr 19, 2024" 或 "2024年4月19日"
```

### formatCurrency ( Finance )

格式化货币。

```typescript
formatCurrency(amount: number, locale: string): string
// 返回: "¥35.50" 或 "$35.50"
```

### tagVariant

获取标签颜色变体。

```typescript
tagVariant(tag: string): 'default' | 'secondary' | 'outline' | 'destructive'
```

---

## LocalStorage Keys

| Key | 数据 | 说明 |
|-----|------|------|
| `flownote-ideas` | `Idea[]` | 灵感数据 |
| `flownote-journal` | `JournalEntry[]` | 日记数据 |
| `flownote-finance` | `Transaction[]` | 财务数据 |
| `flownote-locale` | `'zh' \| 'en'` | 语言偏好 |
| `flownote-chunk-{key}-{index}` | `string` | 分片数据 |

---

## 常量

### Mood 配置

```typescript
const MOOD_EMOJIS: Record<Mood, string> = {
  happy: '😊',
  calm: '😌',
  sad: '😔',
  excited: '🤩',
  tired: '😴',
  anxious: '😰',
}

const MOOD_COLORS: Record<Mood, string> = {
  happy: 'bg-yellow-100 hover:bg-yellow-200',
  calm: 'bg-blue-100 hover:bg-blue-200',
  sad: 'bg-purple-100 hover:bg-purple-200',
  excited: 'bg-pink-100 hover:bg-pink-200',
  tired: 'bg-gray-100 hover:bg-gray-200',
  anxious: 'bg-red-100 hover:bg-red-200',
}
```

### Finance 分类

```typescript
const EXPENSE_CATEGORIES = ['餐饮', '交通', '购物', '娱乐', '居住', '医疗', '教育', '其他']
const INCOME_CATEGORIES = ['工资', '投资', '兼职', '奖金', '其他']

const CATEGORY_ICONS: Record<Category, React.ReactNode>
const CATEGORY_COLORS: Record<Category, string>
```

---

## 类型定义

完整类型定义可在各页面文件中找到：

- `app/app/ideas/page.tsx` - `Idea` 类型
- `app/app/journal/page.tsx` - `JournalEntry`, `Mood` 类型
- `app/app/finance/page.tsx` - `Transaction`, `Category` 类型

---

## 事件处理

### Ideas Page

```typescript
// 打开新建对话框
openNewIdea(): void

// 打开编辑对话框
openEditIdea(idea: Idea): void

// 保存灵感
saveIdea(): void

// 删除灵感
deleteIdea(): void
```

### Journal Page

```typescript
// 打开今日/指定日期
openNewEntry(): void
openEditEntry(date: string): void

// 保存日记
saveEntry(): void

// 删除日记
deleteEntry(): void

// 月份导航
previousMonth(): void
nextMonth(): void
```

### Finance Page

```typescript
// 打开新建交易
openNewTransaction(): void

// 保存交易
saveTransaction(): void

// 删除交易
deleteTransaction(id: string): void

// 月份导航
previousMonth(): void
nextMonth(): void
```

---

## 浏览器 API 使用

### Crypto API

生成 UUID：

```typescript
const id = crypto.randomUUID()  // "550e8400-e29b-41d4-a716-446655440000"
```

### Intl API

日期/数字格式化：

```typescript
// 日期
new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}).format(date)

// 货币
new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY'
}).format(amount)
```

---

## 限制与约束

### 存储限制

- localStorage 配额：约 5-10 MB（浏览器相关）
- 单条数据限制：建议 < 1MB（自动分片处理）
- 分片大小：1MB/片

### 性能建议

- 列表数据 > 1000 条时考虑虚拟滚动
- 图片使用 Base64 存储时控制大小（< 500KB）
- 避免频繁写入 localStorage（使用防抖）

---

**文档版本**: v1.0  
**最后更新**: 2024-04-19
