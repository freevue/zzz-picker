---
description: Git Commit Message Auto Generator
---

Prefix Rule과 Template를 제공해줄게. 해당 Rule을 준수하여 메시지를 작성해줘.

** Prefix Rule **

- new: 새로운 프로젝트 생성 및 개념 추가
- feat: 새로운 기능 개발 및 추가
- fix: 버그 픽스 관련 작업
- refactor: 기능 개선 및 파일 정리

** Templage **

```markdown
[{prefix}]: {commit 제목}

{Commit Message Body}
```

** 메시지 생성시 주의할 점 **

- 전문적인 용어의 경우 영문을 작성하여도 되지만, 전체적인 문법과 문맥의 경우 한글로 작성할 것.
- 제목의 경우 간결하게 작성할 것.
- Body의 경우 최대길이를 3줄을 넘기지 말 것.
- Git의 diff를 찾을때 `git diff --cached`를 사용하여 현재 스테이징에 올라간 파일을 기준으로 삼을 것.
