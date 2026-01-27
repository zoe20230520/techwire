import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Target, Users, Lightbulb } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* 标题部分 */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">关于我们</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            电池技术资讯网致力于为技术人员和行业从业者提供最新、最专业的电池技术资讯
          </p>
        </div>

        {/* 使命愿景 */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <Card className="border-2">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">我们的使命</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                推动电池技术知识的传播与交流，为行业发展提供有价值的信息和洞察，助力技术创新和产业升级。
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Lightbulb className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">我们的愿景</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                成为电池技术领域最具影响力的资讯平台，连接技术人员、研究机构和企业，共同推动清洁能源技术的发展。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 核心价值 */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">核心价值</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Battery className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">专业性</h3>
                <p className="text-sm text-muted-foreground">
                  深耕电池技术领域，提供专业、准确、深度的技术内容
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">开放性</h3>
                <p className="text-sm text-muted-foreground">
                  打造开放的交流平台，促进行业知识共享和技术交流
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">创新性</h3>
                <p className="text-sm text-muted-foreground">
                  关注前沿技术动态，推动电池技术创新和应用发展
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 内容板块 */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">内容板块</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>最新资讯</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  实时追踪电池技术领域的最新动态，包括技术突破、产品发布、政策法规、市场动向等，让您第一时间掌握行业脉搏。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>技术文章</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  深度解析电池技术原理、材料科学、制造工艺、应用场景等，为技术人员提供系统的知识体系和实用的技术指导。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>行业报告</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  提供权威的市场分析、趋势预测、产业链研究等报告，帮助从业者洞察行业发展方向，把握商业机遇。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 联系方式 */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">联系我们</h2>
            <div className="mx-auto max-w-md space-y-2 text-muted-foreground">
              <p>邮箱：contact@battery-tech.net</p>
              <p>电话：400-888-8888</p>
              <p className="pt-4 text-sm">
                欢迎投稿、合作洽谈或提出宝贵意见
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
