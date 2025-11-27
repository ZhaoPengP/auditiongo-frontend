#!/usr/bin/env node
// 停止占用指定端口的进程
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process')
const port = process.argv[2] || '9527'

try {
  // macOS/Linux
  if (process.platform !== 'win32') {
    try {
      const output = execSync(`lsof -ti:${port}`, {
        encoding: 'utf8',
        stdio: 'pipe',
        maxBuffer: 1024 * 1024, // 1MB buffer
      }).trim()

      if (output) {
        // 处理多个 PID（可能是换行或空格分隔）
        const pids = output.split(/\s+/).filter((pid) => {
          const trimmed = pid.trim()
          return trimmed && !isNaN(parseInt(trimmed)) && parseInt(trimmed) > 0
        })

        if (pids.length > 0) {
          let killed = 0
          pids.forEach((pid) => {
            try {
              // 验证进程是否还存在
              execSync(`ps -p ${pid}`, { stdio: 'pipe' })
              execSync(`kill -9 ${pid}`, { stdio: 'pipe' })
              killed++
            } catch (error) {
              // 进程可能已经不存在了，忽略错误
              // 静默处理，不输出错误信息
            }
          })

          if (killed > 0) {
            console.log(`✅ 已清理端口 ${port} 上的 ${killed} 个进程`)
          }
        } else {
          console.log(`ℹ️  端口 ${port} 没有被占用`)
        }
      } else {
        console.log(`ℹ️  端口 ${port} 没有被占用`)
      }
    } catch (lsofError) {
      // lsof 没有找到任何进程（exit code 1），这是正常的
      if (lsofError.status === 1 || lsofError.code === 1) {
        console.log(`ℹ️  端口 ${port} 没有被占用`)
      } else {
        // 其他错误，但不阻止执行
        // 静默处理，继续执行
      }
    }
  } else {
    // Windows
    try {
      const result = execSync(`netstat -ano | findstr :${port}`, {
        encoding: 'utf8',
        stdio: 'pipe',
      })

      if (result) {
        const lines = result.trim().split('\n')
        const pids = new Set()
        lines.forEach((line) => {
          const parts = line.trim().split(/\s+/)
          if (parts.length > 0) {
            const pid = parts[parts.length - 1]
            if (pid && !isNaN(pid)) {
              pids.add(pid)
            }
          }
        })

        pids.forEach((pid) => {
          try {
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe' })
          } catch (error) {
            // 忽略错误
          }
        })

        if (pids.size > 0) {
          console.log(`✅ 已清理端口 ${port} 上的 ${pids.size} 个进程`)
        }
      } else {
        console.log(`ℹ️  端口 ${port} 没有被占用`)
      }
    } catch (error) {
      if (error.status === 1 || error.code === 1) {
        console.log(`ℹ️  端口 ${port} 没有被占用`)
      }
    }
  }
} catch (error) {
  // 外层错误处理 - 不应该到达这里，但如果到达了也不阻止执行
  // 脚本设计为即使失败也不应该阻止后续命令执行
  // 静默失败，确保 build:test 命令链继续执行
}

// 始终以成功状态退出，确保不阻止后续命令
process.exit(0)
