/**!
 *
 *  Copyright 2018 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

let timer

self.addEventListener('message', (event) => {
  const interval = event && event.data && event.data.interval

  if (!interval) {
    console.warn('invalid interval received:', event.data)
    return
  }

  if (timer) {
    clearInterval(timer)
  }

  timer = setInterval(() => self.postMessage({}), interval)
}, false)
