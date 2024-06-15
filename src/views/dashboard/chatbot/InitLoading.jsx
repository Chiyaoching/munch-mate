import { Skeleton, Stack } from '@mui/material'
import React from 'react'


const InitLoading = React.memo(() => {
  return (
    <Stack sx={{width: "70%" }}>
      <Skeleton animation="wave" variant="circular" width={40} height={40} />
      <Skeleton animation="wave" variant="rounded" sx={{ ml: 6, my: 1 }} height={10} width="100%"/>
      <Skeleton animation="wave" variant="rounded" sx={{ ml: 6, my: 1 }} height={10} width="80%"/>
      <Skeleton animation="wave" variant="rounded" sx={{ ml: 6, my: 1 }} height={10} width="60%"/>
      <Skeleton animation="wave" variant="rounded" sx={{ ml: 6, my: 1 }} height={10} width="70%"/>
    </Stack>
  )
})

export default InitLoading