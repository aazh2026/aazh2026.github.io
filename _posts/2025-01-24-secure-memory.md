---
title: 敏感记忆的保险箱：当Agent记住你的秘密
date: 2025-01-24T01:45:00+08:00
tags: [安全, 隐私, 机密计算, 数据隔离]

redirect_from:
  - /secure-memory.html
---

# 敏感记忆的保险箱：当Agent记住你的秘密

## 引言：Agent知道了太多

我的OpenClaw助手知道：
- 我的API密钥
- 我公司的内部项目细节
- 我的一些个人偏好（有些挺尴尬的）
- 我和客户的敏感对话

所有这些，都存储在向量数据库里，以plaintext embedding的形式。

如果有人攻破我的服务器，或者我用的第三方向量DB被入侵——所有这些敏感信息都会暴露。

这就是**敏感记忆的安全问题**：Agent需要记住这些信息才能服务好用户，但记住意味着风险。

## 一、敏感记忆的分类

### 1.1 机密等级

**极度敏感（L1）：**
- 密码、API密钥、私钥
- 个人身份信息（PII）：身份证号、银行卡
- 医疗记录、心理健康信息
- 法律相关：诉讼、合同条款

**高度敏感（L2）：**
- 公司内部信息：未公开产品、战略、财务数据
- 商业机密：客户名单、定价策略
- 个人财务：收入、投资、债务

**中度敏感（L3）：**
- 个人偏好：政治观点、宗教信仰、性取向
- 社交关系：人际冲突、家庭问题
- 位置历史：常去的地方、行踪

**低敏感（L4）：**
- 一般偏好：喜欢的颜色、食物
- 公开信息：职业、教育背景
- 技术偏好：喜欢的编程语言、工具

### 1.2 不同等级的处理策略

```python
class SensitivityLevel:
    L1_CRITICAL = "critical"      # 永不存储，或仅内存中短暂存在
    L2_HIGH = "high"              # 加密存储，严格访问控制
    L3_MEDIUM = "medium"          # 隔离存储，标准加密
    L4_LOW = "low"                # 标准存储

class MemorySecurityPolicy:
    def __init__(self):
        self.policies = {
            SensitivityLevel.L1_CRITICAL: {
                'store': False,  # 不持久化
                'encrypt': True,
                'access_control': 'never_persist'
            },
            SensitivityLevel.L2_HIGH: {
                'store': True,
                'encrypt': 'AES-256-GCM',
                'access_control': 'role_based',
                'audit_log': True
            },
            SensitivityLevel.L3_MEDIUM: {
                'store': True,
                'encrypt': 'AES-256',
                'access_control': 'standard',
                'audit_log': True
            },
            SensitivityLevel.L4_LOW: {
                'store': True,
                'encrypt': False,
                'access_control': 'standard'
            }
        }
```

## 二、检测敏感信息

### 2.1 规则匹配

```python
class SensitiveDataDetector:
    def __init__(self):
        self.patterns = {
            'api_key': r'(sk-|pk-)[a-zA-Z0-9]{32,}',
            'password': r'password[:\s]*[^\s]{8,}',
            'credit_card': r'\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}',
            'ssn': r'\d{3}-\d{2}-\d{4}',
            'email': r'[\w.-]+@[\w.-]+\.\w+',
            'phone': r'\+?1?\d{9,15}'
        }
    
    def scan(self, text):
        findings = []
        for label, pattern in self.patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                findings.append({
                    'type': label,
                    'position': (match.start(), match.end()),
                    'confidence': 0.95  # 规则匹配高置信度
                })
        return findings
```

### 2.2 ML分类器

规则无法检测所有情况，需要ML：

```python
class MLSensitivityClassifier:
    def __init__(self, model_path):
        self.model = load_model(model_path)  # 微调过的BERT
    
    def predict(self, text):
        """
        返回敏感度分数 (0-1)
        0 = 完全公开
        1 = 极度敏感
        """
        embedding = self.model.encode(text)
        score = self.model.predict_proba(embedding)[0][1]
        return score
    
    def classify(self, text, threshold_high=0.7, threshold_critical=0.9):
        score = self.predict(text)
        
        if score > threshold_critical:
            return SensitivityLevel.L1_CRITICAL
        elif score > threshold_high:
            return SensitivityLevel.L2_HIGH
        elif score > 0.4:
            return SensitivityLevel.L3_MEDIUM
        else:
            return SensitivityLevel.L4_LOW
```

### 2.3 用户显式标记

让用户可以标记敏感信息：

```
用户：我的API密钥是sk-12345...[标记为机密]
Agent：收到，我会以最高安全级别处理这个信息。
```

## 三、加密存储方案

### 3.1 客户端加密（推荐）

数据在离开用户设备前就加密：

```python
class ClientSideEncryption:
    def __init__(self, user_password):
        # 从用户密码派生加密密钥
        self.key = PBKDF2(
            password=user_password,
            salt=os.urandom(16),
            dkLen=32,
            count=100000
        )
    
    def encrypt(self, plaintext):
        """AES-256-GCM加密"""
        nonce = os.urandom(12)
        cipher = AES.new(self.key, AES.MODE_GCM, nonce=nonce)
        ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())
        
        return {
            'ciphertext': base64.b64encode(ciphertext).decode(),
            'nonce': base64.b64encode(nonce).decode(),
            'tag': base64.b64encode(tag).decode()
        }
    
    def decrypt(self, encrypted_data):
        cipher = AES.new(
            self.key, 
            AES.MODE_GCM, 
            nonce=base64.b64decode(encrypted_data['nonce'])
        )
        plaintext = cipher.decrypt_and_verify(
            base64.b64decode(encrypted_data['ciphertext']),
            base64.b64decode(encrypted_data['tag'])
        )
        return plaintext.decode()
```

**优点：** 即使服务器被攻破，数据也是加密的。

**缺点：** 用户需要记住密码，丢失密码=丢失数据。

### 3.2 服务端加密 + HSM

使用硬件安全模块（HSM）管理密钥：

```python
class HSMEncryption:
    def __init__(self, hsm_client):
        self.hsm = hsm_client
    
    def encrypt(self, data, key_id='memory-key'):
        # 密钥永远不出HSM
        encrypted = self.hsm.encrypt(
            data=data,
            key_id=key_id,
            mechanism='AES_GCM'
        )
        return encrypted
    
    def decrypt(self, encrypted_data, key_id='memory-key'):
        plaintext = self.hsm.decrypt(
            data=encrypted_data,
            key_id=key_id,
            mechanism='AES_GCM'
        )
        return plaintext
```

**优点：** 密钥在硬件中，即使服务器被入侵也难提取。

**缺点：** 依赖HSM供应商，成本高。

### 3.3 分片存储

将敏感数据分成多份，存储在不同位置：

```python
class SecretSharing:
    def __init__(self, n=5, k=3):
        """
        n: 总分片数
        k: 恢复所需的最小分片数
        """
        self.n = n
        self.k = k
    
    def store(self, secret):
        # 使用Shamir's Secret Sharing
        shares = generate_shares(secret, self.n, self.k)
        
        # 存储到不同位置
        locations = [
            'local_encrypted_db',
            'user_device',
            'cloud_storage_1',
            'cloud_storage_2',
            'offline_backup'
        ]
        
        for i, share in enumerate(shares):
            self._store_at(share, locations[i])
        
        return locations
    
    def retrieve(self, available_locations):
        shares = [self._retrieve_from(loc) for loc in available_locations]
        if len(shares) >= self.k:
            return reconstruct_secret(shares)
        else:
            raise InsufficientSharesError()
```

**优点：** 单一位置被攻破不会泄露完整信息。

**缺点：** 复杂性高，检索时需要协调多个位置。

## 四、隔离与访问控制

### 4.1 内存隔离

敏感信息只在受保护的内存区域处理：

```python
class SecureEnclave:
    """模拟机密计算环境（如Intel SGX, AMD SEV）"""
    
    def __init__(self):
        self.enclave = create_secure_enclave()
    
    def process_sensitive_data(self, data, operation):
        """
        在enclave内处理数据，外部无法访问
        """
        result = self.enclave.execute(operation, data)
        # 只返回处理结果，不暴露中间状态
        return result
    
    def generate_embedding(self, text):
        """在enclave内生成embedding，明文不出enclave"""
        embedding = self.enclave.execute('embed', text)
        return embedding  # 返回的embedding是加密的
```

### 4.2 角色基础访问控制（RBAC）

```python
class RBACSystem:
    def __init__(self):
        self.roles = {
            'user': ['read_own_memory', 'write_own_memory'],
            'admin': ['read_all_memory', 'delete_memory', 'audit_logs'],
            'system': ['process_memory', 'generate_embeddings']
        }
    
    def check_permission(self, user_id, action, memory_id):
        user_role = self.get_user_role(user_id)
        memory_owner = self.get_memory_owner(memory_id)
        memory_sensitivity = self.get_memory_sensitivity(memory_id)
        
        # 用户只能访问自己的非极度敏感记忆
        if user_role == 'user' and memory_owner == user_id:
            if memory_sensitivity != SensitivityLevel.L1_CRITICAL:
                return True
        
        # 其他情况需要更高权限
        return False
```

### 4.3 审计日志

记录所有敏感数据的访问：

```python
class SecurityAuditLog:
    def log_access(self, user_id, memory_id, action, timestamp):
        entry = {
            'timestamp': timestamp,
            'user_id': user_id,
            'memory_id': hash(memory_id),  # 匿名化
            'action': action,  # 'read', 'write', 'delete'
            'ip_address': get_client_ip(),
            'success': True
        }
        
        # 写入防篡改日志
        self._append_to_immutable_log(entry)
        
        # 实时告警
        if self._is_suspicious(entry):
            self._send_alert(entry)
```

## 五、隐私增强技术

### 5.1 差分隐私

在记忆检索结果中添加噪声，防止推断攻击：

```python
class DifferentialPrivacy:
    def __init__(self, epsilon=1.0):
        self.epsilon = epsilon  # 隐私预算
    
    def privatize_results(self, results):
        """在相似度分数上加拉普拉斯噪声"""
        noisy_results = []
        for result in results:
            noise = np.random.laplace(0, 1/self.epsilon)
            result.score += noise
            noisy_results.append(result)
        
        return noisy_results
```

### 5.2 联邦记忆

用户的敏感记忆只在用户设备上，Agent只上传聚合后的匿名模式：

```python
class FederatedMemory:
    def local_training(self, user_data):
        # 在用户设备上训练本地模型
        local_model = train(user_data)
        
        # 只上传模型更新，不上传原始数据
        model_update = local_model.get_weights()
        
        # 加密上传
        encrypted_update = encrypt(model_update)
        return encrypted_update
    
    def global_aggregation(self, encrypted_updates):
        # 服务器聚合加密更新
        global_model = aggregate(encrypted_updates)
        return global_model
```

## 六、合规与最佳实践

### 6.1 GDPR/CCPA合规

- **被遗忘权**：用户可以要求删除所有关于他们的数据
- **可携带权**：用户可以获得他们的数据副本
- **透明度**：明确告知用户数据如何使用
- **最小化**：只收集必要的数据

### 6.2 最佳实践清单

**存储前：**
- [ ] 扫描敏感信息
- [ ] 分类敏感度等级
- [ ] 高敏感数据加密
- [ ] 用户确认（如果是敏感信息）

**存储中：**
- [ ] 定期审计访问日志
- [ ] 监控异常访问模式
- [ ] 定期轮换加密密钥
- [ ] 备份加密数据

**检索时：**
- [ ] 验证用户权限
- [ ] 记录访问日志
- [ ] 脱敏展示（如需要）
- [ ] 提供数据来源解释

## 七、总结

敏感记忆的安全不是可选项，是**必选项**。

当Agent成为我们的数字伙伴，它不可避免地会接触到我们的秘密。作为开发者，我们有责任确保这些秘密的安全。

核心原则：
1. **最小化**：只记住必须记住的
2. **加密化**：敏感数据必须加密
3. **隔离化**：不同敏感度的数据分层处理
4. **透明化**：用户知道Agent记住了什么
5. **可控化**：用户可以删除、纠正、导出

信任建立在安全之上。没有安全，就没有真正的Agent。

---

**延伸阅读：**
- Goldreich, O. (2004). "Foundations of Cryptography"
- Dwork, C. & Roth, A. (2014). "The Algorithmic Foundations of Differential Privacy"
- Costan, V. & Devadas, S. (2016). "Intel SGX Explained"

**标签：** #安全 #隐私 #机密计算 #数据隔离 #加密 #合规
