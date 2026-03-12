---
layout: post
title: 接口隔离：人类与 AI 的契约设计
date: 2026-03-15T10:00:00+08:00
tags: [接口隔离, SOLID, Intent-Driven, AI-Native, 软件工程]

redirect_from:
  - /2026/03/15/interface-segregation.html
---

# 接口隔离：人类与 AI 的契约设计

## TL;DR

AI-Native 开发中，**人类与 AI 的交互本质上是一种契约关系**。接口隔离原则（Interface Segregation Principle）在 AI 时代的核心启示是：将"胖接口"拆分为"瘦接口"——不是让 AI 理解人类的一切意图，而是人类通过清晰的 Intent 接口、Context 接口和 Prompt 接口与 AI 对话。好的契约设计让 AI 成为可靠的协作者，而不是猜谜游戏的对手。

**核心公式：**
```
有效协作 = 清晰的边界 + 明确的契约 + 可预测的错误处理
```

---

## 📋 本文结构

- **第3节**：回顾 SOLID 中的 I——为什么胖接口会毁掉协作
- **第4节**：AI 时代三种新接口形态——Intent、Context、Prompt
- **第5节**：人类-AI 契约设计的四个要素
- **第6节**：实战设计 Intent 接口的粒度与一致性
- **第7节**：接口演化策略——向后兼容的艺术
- **第8节**：三个反直觉洞察
- **第9节**：工具链与最佳实践清单

---

## 一、接口隔离原则回顾：SOLID 中的 I

### 1.1 胖接口 vs 瘦接口

Robert C. Martin 在 SOLID 原则中提出：**"Clients should not be forced to depend on methods they do not use."**

**传统软件中的胖接口问题：**

```python
# ❌ 胖接口：一个接口承担了太多职责
class UniversalAIClient:
    def chat(self, prompt: str) -> str: ...
    def code_review(self, diff: str) -> list: ...
    def generate_image(self, desc: str) -> bytes: ...
    def analyze_sentiment(self, text: str) -> float: ...
    def summarize_document(self, doc: str) -> str: ...
    def translate(self, text: str, target_lang: str) -> str: ...
    
# 问题：如果你只需要聊天功能，却不得不了解所有方法
```

**瘦接口拆分：**

```python
# ✅ 瘦接口：每个接口只做一件事
class ChatInterface:
    def chat(self, messages: list[Message]) -> Response: ...

class CodeReviewInterface:
    def review(self, diff: str, context: ReviewContext) -> ReviewResult: ...

class ImageGenerationInterface:
    def generate(self, prompt: str, options: ImageOptions) -> ImageResult: ...
```

### 1.2 为什么瘦接口更好

| 维度 | 胖接口 | 瘦接口 |
|-----|--------|--------|
| 理解成本 | 高（需要了解全部功能） | 低（只需了解相关部分） |
| 变更影响 | 大（一改牵动全局） | 小（局部修改） |
| 测试难度 | 高（需要覆盖所有方法） | 低（只测相关接口） |
| 可组合性 | 差（难以灵活组合） | 强（按需组合） |

**💡 关键洞察：** 接口隔离的本质是**关注点分离**——让调用者只依赖他们真正需要的东西。

---

## 二、AI 时代的接口新形态

当人类成为"调用者"、AI 成为"服务提供者"时，接口的形态发生了根本性变化。我们需要三种新接口：

### 2.1 Intent 接口：意图的契约

**定义：** Intent 接口是人类表达"想要什么"的规范化方式。

**传统的模糊表达：**
```
"帮我看看这段代码有没有问题"
```
问题：什么问题？风格问题？逻辑问题？性能问题？安全问题？

**Intent 接口的规范化：**

```yaml
# intent-schema.yaml
intent:
  type: enum[code_review, code_generate, code_explain, refactor]
  scope: enum[function, module, project]
  focus_areas: list[enum[style, logic, performance, security, maintainability]]
  constraints:
    max_suggestions: int
    severity_threshold: enum[info, warning, error]
  output_format: enum[inline_comments, summary_report, structured_json]
```

**使用示例：**

```python
# ✅ 清晰的 Intent 接口调用
review_intent = CodeReviewIntent(
    type="code_review",
    scope="function",
    focus_areas=["logic", "security"],
    constraints=Constraints(
        max_suggestions=5,
        severity_threshold="warning"
    ),
    output_format="inline_comments"
)

result = ai.execute(review_intent, context={"code": user_code})
```

### 2.2 Context 接口：上下文的边界

**定义：** Context 接口规定了 AI 能"看到"什么、不能"看到"什么。

**Context 的组成：**

```typescript
interface ContextInterface {
  // 1. 必要上下文（必须提供）
  required: {
    task_description: string;
    input_data: any;
  };
  
  // 2. 可选上下文（增强理解）
  optional: {
    relevant_files?: string[];
    coding_standards?: string;
    previous_attempts?: AttemptHistory[];
    user_preferences?: UserPreferences;
  };
  
  // 3. 限制上下文（防止越界）
  constraints: {
    max_tokens?: number;
    forbidden_topics?: string[];
    privacy_level?: 'public' | 'internal' | 'confidential';
    time_budget_ms?: number;
  };
}
```

**💡 关键洞察：** 好的 Context 接口不是"给 AI 越多信息越好"，而是"给 AI 刚好足够的信息"。信息过载会导致注意力分散，信息不足会导致猜测和幻觉。

### 2.3 Prompt 接口：提示的结构化

**定义：** Prompt 接口是将人类意图转化为 AI 可理解指令的模板化机制。

**非结构化的 Prompt（容易出错）：**
```
"写个函数，要处理用户输入，然后保存到数据库，记得验证"
```

**结构化的 Prompt 接口：**

```yaml
# prompt-template.yaml
name: data_validation_function
template: |
  ## 任务
  创建一个 {language} 函数，用于 {operation}。
  
  ## 输入规范
  {input_schema}
  
  ## 验证规则
  {validation_rules}
  
  ## 输出要求
  {output_requirements}
  
  ## 约束条件
  - 最大圈复杂度: {max_complexity}
  - 必须包含的错误处理: {error_handling}
  - 性能要求: {performance_requirements}
  
  ## 参考示例
  {examples}

variables:
  language: string
  operation: string  
  input_schema: json_schema
  validation_rules: list[Rule]
  output_requirements: OutputSpec
  max_complexity: int
  error_handling: list[string]
  performance_requirements: PerformanceSpec
  examples: list[Example]
```

**Prompt 接口的优势：**
1. **可重复** —— 相同输入产生一致输出
2. **可验证** —— 可以检查变量是否完整
3. **可版本化** —— 模板变更可追溯
4. **可组合** —— 小模板组合成大模板

---

## 三、人类-AI 契约设计

好的契约设计让协作变得可预测。一个完整的人类-AI 契约包含四个要素：

### 3.1 清晰的边界

**边界定义了什么属于"这个任务"、什么不属于。**

```python
# ❌ 边界模糊的契约
class VagueContract:
    """帮我处理数据"""
    pass  # 什么数据？怎么处理？处理到什么程度？

# ✅ 边界清晰的契约  
class ClearContract:
    """
    契约：CSV 数据清洗
    
    输入边界：
    - 格式：UTF-8 编码的 CSV 文件
    - 大小：最大 10MB
    - 列数：1-50 列
    - 行数：1-100,000 行
    
    处理边界：
    - 去除空行和完全重复的行
    - 标准化日期格式为 ISO 8601
    - 修复常见编码错误（如智能引号）
    - 不修改数据语义（不做聚合、不删除列）
    
    输出边界：
    - 格式：清洗后的 CSV
    - 编码：UTF-8
    - 包含：原始数据 + 清洗报告
    """
```

### 3.2 明确的输入输出

**使用类型系统定义契约：**

```typescript
// 输入契约
interface DataCleaningInput {
  csvData: string;           // 原始 CSV 内容
  options: CleaningOptions;  // 清洗选项
}

interface CleaningOptions {
  removeEmptyRows: boolean;
  standardizeDates: boolean;
  fixEncoding: boolean;
  dateFormat?: 'ISO8601' | 'RFC2822';
}

// 输出契约
interface DataCleaningOutput {
  cleanedData: string;       // 清洗后的 CSV
  report: CleaningReport;    // 处理报告
}

interface CleaningReport {
  rowsProcessed: number;
  rowsRemoved: number;
  datesStandardized: number;
  encodingFixes: number;
  errors: CleaningError[];   // 无法自动修复的问题
}

// 错误契约
type CleaningError = 
  | { type: 'MALFORMED_DATE'; row: number; column: string; value: string }
  | { type: 'INVALID_ENCODING'; row: number; message: string }
  | { type: 'SIZE_LIMIT_EXCEEDED'; details: string };
```

### 3.3 错误处理约定

**错误处理契约模板：**

```yaml
error_handling_contract:
  # 1. 错误分类
  categories:
    - INPUT_VALIDATION: 输入不符合规范
    - PROCESSING_ERROR: 处理过程中出错
    - RESOURCE_LIMIT: 超出资源限制（时间/内存）
    - AMBIGUOUS_INPUT: 输入存在歧义，需要澄清
    
  # 2. 错误响应格式
  response_format:
    status: error
    error_code: string        # 机器可读的错误码
    message: string           # 人类可读的错误信息
    severity: enum[low, medium, high, critical]
    recoverable: boolean      # 是否可以通过修改输入恢复
    suggestions: list[string] # 修复建议
    
  # 3. 升级策略
  escalation:
    low: "AI 尝试自动修复，记录日志"
    medium: "AI 返回错误，提供备选方案"
    high: "AI 停止处理，请求人类介入"
    critical: "AI 立即停止，保存上下文，通知管理员"
```

### 3.4 版本与演化策略

**接口版本化示例：**

```yaml
contract:
  name: data_cleaning_service
  version: 2.1.0
  
  # 兼容性声明
  compatibility:
    min_supported: 1.0.0    # 最低支持的输入版本
    current: 2.1.0          # 当前版本
    
  # 弃用通知
  deprecated_features:
    - name: old_date_format
      deprecated_in: 2.0.0
      removal_in: 3.0.0
      migration_guide: "使用 dateFormat 替代 oldDateFormat"
      
  # 新增功能
  new_features:
    - name: encoding_detection
      added_in: 2.1.0
      description: "自动检测输入文件编码"
```

---

## 四、实战：设计良好的 Intent 接口

### 4.1 粒度设计：多细才算合适？

**粒度太粗的问题：**

```python
# ❌ 粒度太粗：一个接口做太多事
class OmnipotentAI:
    def do_something(self, description: str) -> Any:
        """
        根据描述做各种事情：
        - 可以写代码
        - 可以分析数据
        - 可以生成文档
        - 可以 debug
        """
        pass
```

**粒度太细的问题：**

```python
# ❌ 粒度太细：过度碎片化
class OverlyGranularAI:
    def write_function_signature(self, name: str, params: list) -> str: ...
    def write_function_docstring(self, description: str) -> str: ...
    def write_function_body_line(self, line_number: int) -> str: ...
    def add_import_statement(self, module: str) -> str: ...
```

**恰到好处的粒度：**

```python
# ✅ 基于任务的粒度
class CodeGenerationInterface:
    def generate_function(self, spec: FunctionSpec) -> GeneratedFunction: ...
    def generate_class(self, spec: ClassSpec) -> GeneratedClass: ...
    def generate_module(self, spec: ModuleSpec) -> GeneratedModule: ...

class CodeModificationInterface:
    def refactor_function(self, func: Function, changes: RefactorPlan) -> Function: ...
    def add_error_handling(self, func: Function, error_types: list[Type]) -> Function: ...
    def optimize_performance(self, func: Function, target: OptimizationTarget) -> Function: ...
```

### 4.2 一致性设计：降低认知负荷

**命名一致性：**

```python
# ✅ 一致的动词前缀
interface.generate_function()      # 生成新内容
interface.refactor_function()      # 重构已有内容
interface.analyze_function()       # 分析内容
interface.validate_function()      # 验证内容

# ✅ 一致的参数顺序
interface.do_action(target, options, context)
# 而不是
interface.do_action(options, target, context)  # ❌ 不一致
```

**结构一致性：**

```typescript
// 所有输入都遵循相同结构
interface Intent<T extends string, P, R> {
  intent: T;           // 意图类型
  payload: P;          // 意图参数
  context?: Context;   // 可选上下文
}

// 所有输出都遵循相同结构  
interface IntentResult<S, D, E> {
  status: S;           // 状态
  data?: D;            // 成功时的数据
  error?: E;           // 失败时的错误
  metadata: Metadata;  // 元数据（耗时、token数等）
}
```

### 4.3 可组合性设计

**乐高积木式的接口设计：**

```python
# 基础积木
@dataclass
class Intent:
    """所有 Intent 的基类"""
    id: str
    timestamp: datetime
    
@dataclass  
class CodeIntent(Intent):
    """代码相关 Intent 的基类"""
    language: str
    code_context: CodeContext

# 组合成复杂 Intent
@dataclass
class GenerateAndReviewIntent(Intent):
    """组合：生成代码并评审"""
    generation: GenerateCodeIntent      # 基础积木 1
    review: CodeReviewIntent            # 基础积木 2
    execution_order: Literal["sequential", "parallel"]
    
    # 组合逻辑
    def execute(self, ai: AI) -> CombinedResult:
        if self.execution_order == "sequential":
            generated = ai.execute(self.generation)
            review_input = {**self.review, "code": generated}
            return ai.execute(review_input)
        else:
            # 并行执行
            ...
```

**实战示例：复杂工作流：**

```python
# 一个完整的代码审查工作流
workflow = Workflow([
    # Step 1: 理解代码
    UnderstandCodeIntent(files=changed_files),
    
    # Step 2: 分析影响
    AnalyzeImpactIntent(scope="module", dependencies=get_deps()),
    
    # Step 3: 检查安全
    SecurityReviewIntent(level="comprehensive"),
    
    # Step 4: 风格检查  
    StyleReviewIntent(standard="team_guidelines"),
    
    # Step 5: 综合生成报告
    GenerateReportIntent(
        sections=["summary", "issues", "suggestions", "action_items"],
        audience="developer"
    )
])

result = ai.execute_workflow(workflow)
```

---

## 五、接口版本与演化

### 5.1 向后兼容的策略

**策略 1：添加而非修改**

```python
# ✅ 向后兼容：添加新字段
class CodeReviewInput_v1:
    code: str
    
class CodeReviewInput_v2:
    code: str
    language: str           # 新增：可选，有默认值
    review_focus: list      # 新增：可选，有默认值

# 处理逻辑
if input.version == "v1":
    # 使用默认值填充新字段
    input.language = detect_language(input.code)
    input.review_focus = ["logic", "style"]
```

**策略 2：使用可选参数**

```typescript
// ✅ 新参数都是可选的
interface GenerateCodeOptions {
  language: string;
  // 新增参数都有默认值
  maxLines?: number;           // 默认: 100
  includeComments?: boolean;   // 默认: true
  styleGuide?: string;         // 默认: "default"
}
```

**策略 3：版本协商**

```python
class AIContract:
    SUPPORTED_VERSIONS = ["1.0", "1.1", "2.0"]
    
    def execute(self, intent: Intent) -> Result:
        # 协商使用哪个版本
        requested_version = intent.version or "1.0"
        
        if requested_version not in self.SUPPORTED_VERSIONS:
            # 找到最接近的兼容版本
            compatible_version = self._find_compatible_version(requested_version)
            return VersionNegotiationResponse(
                requested=requested_version,
                actual=compatible_version,
                breaking_changes=self._get_breaking_changes(requested_version)
            )
        
        return self._execute_with_version(intent, requested_version)
```

### 5.2 弃用策略

**渐进式弃用流程：**

```yaml
# deprecation-timeline.yaml
feature: old_parameter_style

deprecation_schedule:
  phase_1_announcement:
    version: 2.0.0
    action: 在文档中标记弃用，提供迁移指南
    duration: 3个月
    
  phase_2_warning:
    version: 2.1.0  
    action: 运行时发出弃用警告
    duration: 3个月
    
  phase_3_strict:
    version: 2.2.0
    action: 可选参数变为必需，拒绝旧格式
    duration: 2个月
    
  phase_4_removal:
    version: 3.0.0
    action: 完全移除旧代码
```

### 5.3 迁移路径

**自动化迁移工具：**

```python
class IntentMigration:
    """Intent 版本迁移工具"""
    
    MIGRATIONS = {
        ("1.0", "2.0"): migrate_v1_to_v2,
        ("2.0", "2.1"): migrate_v2_to_v2_1,
    }
    
    @staticmethod
    def migrate(intent: Intent, target_version: str) -> Intent:
        current = intent.version
        
        while current != target_version:
            next_version = find_next_version(current, target_version)
            migrator = MIGRATIONS.get((current, next_version))
            
            if not migrator:
                raise MigrationError(f"无法从 {current} 迁移到 {next_version}")
            
            intent = migrator(intent)
            current = next_version
        
        return intent

# 迁移函数示例
def migrate_v1_to_v2(intent: Intent) -> Intent:
    """v1 到 v2 的迁移"""
    if "review_type" in intent.payload:
        # 旧字段映射到新字段
        intent.payload["review_focus"] = [intent.payload.pop("review_type")]
    
    intent.version = "2.0"
    return intent
```

---

## 六、反直觉洞察

### 洞察 1："更少上下文 = 更好结果"

**直觉：** 给 AI 越多上下文，它理解得越准确。

**现实：** 上下文过载会导致注意力分散，关键信息被淹没。

```python
# ❌ 信息过载
context = {
    "entire_codebase": 1000000,  # 100万行代码
    "git_history": "全部提交历史",
    "team_docs": "所有设计文档",
    "similar_issues": "过去5年的所有bug"
}

# ✅ 精心筛选的上下文
context = {
    "relevant_files": ["src/auth/login.py", "tests/test_login.py"],
    "recent_changes": "最近3次相关提交",
    "error_message": "具体的错误堆栈",
    "expected_behavior": "一句话描述期望行为"
}
```

### 洞察 2："显式约束 > 隐式理解"

**直觉：** AI 很聪明，应该能"理解"我的意图。

**现实：** 显式的约束比隐式的假设更可靠。

```python
# ❌ 隐式假设
prompt = "优化这个函数"
# AI 可能：缩短代码？提高性能？增加可读性？

# ✅ 显式约束
intent = OptimizeIntent(
    target="performance",
    constraints={
        "time_complexity": "保持 O(n)",
        "space_complexity": "不增加额外空间",
        "maintainability": "不降低可读性",
        "test_coverage": "不改变测试行为"
    },
    success_criteria="benchmark 提升至少 20%"
)
```

### 洞察 3："契约应该'拒绝'而不是'猜测'"

**直觉：** AI 应该尽可能帮用户完成任务，即使输入不完美。

**现实：** 模糊的输入导致模糊的结果，明确的拒绝比错误的猜测更好。

```python
# ❌ 宽容的契约（导致意外行为）
class LenientContract:
    def review_code(self, code: str = None, file_path: str = None):
        if code is None and file_path:
            code = read_file(file_path)  # 隐式读取
        elif code is None:
            code = "整个项目代码"  # 危险！
        # ...

# ✅ 严格的契约
class StrictContract:
    def review_code(self, input: CodeReviewInput):
        if not input.code and not input.file_path:
            raise ValidationError("必须提供 code 或 file_path")
        
        if input.file_path and not input.code:
            raise ValidationError(
                "Contract 不负责文件读取，" +
                "请使用 FileContext 提供文件内容"
            )
```

---

## 七、工具链与最佳实践

### 7.1 契约定义工具

**JSON Schema 定义契约：**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "code-review-intent",
  "title": "Code Review Intent",
  "type": "object",
  "required": ["intent", "payload"],
  "properties": {
    "intent": {
      "const": "code_review"
    },
    "payload": {
      "type": "object",
      "required": ["code"],
      "properties": {
        "code": {
          "type": "string",
          "minLength": 1,
          "description": "待审查的代码"
        },
        "language": {
          "type": "string",
          "enum": ["python", "javascript", "typescript", "go"]
        },
        "focus_areas": {
          "type": "array",
          "items": {
            "enum": ["logic", "security", "performance", "style"]
          },
          "maxItems": 4
        }
      }
    }
  }
}
```

### 7.2 契约验证工具

```python
from jsonschema import validate, ValidationError

class IntentValidator:
    def __init__(self):
        self.schemas = load_schemas()
    
    def validate(self, intent: dict) -> ValidationResult:
        intent_type = intent.get("intent")
        schema = self.schemas.get(intent_type)
        
        if not schema:
            return ValidationResult(
                valid=False,
                errors=[f"未知的 intent 类型: {intent_type}"]
            )
        
        try:
            validate(instance=intent, schema=schema)
            return ValidationResult(valid=True)
        except ValidationError as e:
            return ValidationResult(
                valid=False,
                errors=[self._format_error(e)]
            )
```

### 7.3 最佳实践清单

**设计阶段：**
- [ ] 明确定义契约的边界（什么做、什么不做）
- [ ] 使用类型系统定义输入输出
- [ ] 设计合理的错误分类和响应
- [ ] 规划版本演化策略

**实现阶段：**
- [ ] 先写契约，再写实现
- [ ] 为契约编写自动化测试
- [ ] 实现严格的输入验证（拒绝 > 猜测）
- [ ] 记录每个契约的变更日志

**使用阶段：**
- [ ] 在调用前验证输入
- [ ] 处理所有错误情况
- [ ] 监控契约使用情况（频率、成功率、错误分布）
- [ ] 收集反馈持续优化

**演化阶段：**
- [ ] 保持向后兼容至少一个主版本
- [ ] 提前公告弃用计划
- [ ] 提供自动化迁移工具
- [ ] 维护变更日志和迁移指南

### 7.4 契约模板

```yaml
# contract-template.yaml
metadata:
  name: ""
  version: "1.0.0"
  author: ""
  created_at: ""
  
contract:
  purpose: ""
  
  input:
    required: []
    optional: []
    constraints: {}
    
  output:
    success: {}
    error: {}
    
  boundaries:
    in_scope: []
    out_of_scope: []
    
  errors:
    categories: []
    escalation_rules: {}
    
  performance:
    max_latency_ms: 0
    max_tokens: 0
    
  versioning:
    current: ""
    supported: []
    deprecated: []
```

---

## 八、结语

接口隔离原则在 AI 时代的核心启示是：**清晰的契约胜过聪明的猜测**。

当人类与 AI 协作时，我们不是在和一个全知的 oracle 对话，而是在和一个强大的 but 需要明确指引的协作者共事。好的契约设计：

1. **降低认知负荷** —— 双方都知道该期待什么
2. **提高可靠性** —— 可预测的结果比"有时候很好"更重要
3. **支持演化** —— 清晰的边界让变更变得可控

**记住这个公式：**

```
有效协作 = 清晰的边界 + 明确的契约 + 可预测的错误处理
```

在 AI-Native 的开发范式中，花时间在契约设计上，是最值得的投资。因为一旦契约确定，AI 就能成为真正可靠的协作者，而不是一个需要你不断纠正方向的实习生。

**下一步：**
- 回顾你现有的 AI 交互，找出"胖接口"
- 选择一个高频场景，设计一个清晰的 Intent 接口
- 建立团队的 AI 契约规范

---

*本文是 Agent OS 系列的第 4 篇。系列索引：[Agent OS: 重新思考 AI 时代的开发范式](/2026/03/10/agent-os-intro.html)*

---

## 参考与延伸阅读

1. Robert C. Martin - *Agile Software Development, Principles, Patterns, and Practices* (SOLID 原则来源)
2. *Designing Data-Intensive Applications* - Martin Kleppmann (契约设计的经典)
3. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) (接口规范的行业标准)
4. [JSON Schema](https://json-schema.org/) (结构化数据验证)

---

*有问题或想法？欢迎在评论区讨论。*
