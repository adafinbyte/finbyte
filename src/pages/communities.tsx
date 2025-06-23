import Head from "next/head"

import ExploreProjects from "@/components/explore/projects"
import { CuratedTokens, PlatformQuickLinks, PlatformStats } from "@/components/default-layout/right-sidebar"
import DefaultLayout from "@/components/default-layout"

export default function Explore() {
  const right_sidebar_contents = (
    <>
      <PlatformStats />
      <CuratedTokens />
      <PlatformQuickLinks/>
    </>
  )

  return (
    <>
      <Head>
        <title>Communities - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <ExploreProjects />
      </DefaultLayout>
    </>
  )
}
