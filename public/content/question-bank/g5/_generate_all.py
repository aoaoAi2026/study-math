# -*- coding:utf-8 -*-
import json, os, sys
base = r"E:\internal_safe\study-math\public\content\question-bank\g5"

def Q(id_, typ, diff, stem, opts, ans, accept, sol, hints, mistakes, kps, t, tags):
    lb = {1:"入门",2:"基础",3:"进阶",4:"拔高",5:"竞赛"}[diff]
    b  = {1:-1.5,2:-0.5,3:0.5,4:1.2,5:1.8}[diff]
    return {"id":id_,"type":typ,"difficulty":diff,"difficultyLabel":lb,"stem":stem,"image":"",
            "options":opts,"answer":ans,"acceptableAnswers":accept,"solution":sol,"hints":hints,
            "commonMistakes":[{"mistake":m[0],"reason":m[1],"correction":m[2],"errorLayer":m[3]} for m in mistakes],
            "source":{"type":"textbook","name":"人教版五年级","year":2024} if kps[0] in ["方程","分数","面积","体积","概率"] else {"type":"olympiad","name":"奥数训练","year":2024},
            "knowledgePoints":kps,"estimatedTime":t,"irtParams":{"a":1.0,"b":b,"c":0.25},"tags":tags}

def save(tid, tname, cat, qs):
    data = {"topicId":tid,"topicName":tname,"grade":5,"category":cat,"version":"1.0",
            "totalQuestions":len(qs),"questions":qs}
    with open(os.path.join(base, tid+".json"),"w",encoding="utf-8") as f:
        json.dump(data,f,ensure_ascii=False,indent=2)
    print(f"  ✓ {tname} ({tid}): {len(qs)}题")

print("开始生成剩余题库...\n")
# 占位符
pass
